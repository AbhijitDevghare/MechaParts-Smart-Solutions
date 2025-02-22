const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    path: {
      type: String,
    },
  },
  { timestamps: true }
);

CategorySchema.pre("save", async function (next) {
  try {
    if (this.parentCategory) {
      const parent = await mongoose.model("Category").findById(this.parentCategory);

      if (!parent) {
        return next(new Error("Parent category not found."));
      }

      this.path = `${parent.path ? parent.path : ""}/${this.name.toLowerCase().replace(/ /g, "-")}`;
    } else {
      this.path = this.name.toLowerCase().replace(/ /g, "-");
    }

    next();
  } catch (error) {
    next(error);
  }
});



CategorySchema.pre("findOneAndDelete", async function (next) {
  try {
      const categoryId = this.getQuery()._id; // Get the category being deleted

      // Function to recursively delete child categories
      const deleteSubcategories = async (parentId) => {
          const children = await mongoose.model("Category").find({ parentCategory: parentId });

          for (const child of children) {
              await deleteSubcategories(child._id); // Recursively delete subcategories
              await mongoose.model("Category").findByIdAndDelete(child._id); // Delete the child category
          }
      };

      // Start recursive deletion for the given category
      await deleteSubcategories(categoryId);

      next();
  } catch (error) {
      next(error);
  }
});


module.exports = mongoose.model("Category", CategorySchema);
