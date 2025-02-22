const Category = require("../../models/productSchemas/categorySchema");

class CategoryRepository {
    async createCategory(categoryData) {
        const newCategory = new Category(categoryData);
        return await newCategory.save();
    }

    async findCategoryById(id) {
        return Category.findById(id);
    }

    async findCategoryByName(name) {
        return Category.findOne({ name }); 
    }


    async deleteCategory(id) {
        console.log("   ID -----",id)
        // Use findOneAndDelete to trigger the recursive deletion middleware
        return await Category.findOneAndDelete({ _id: id });  
    }
    

    async editCategory(id, updateData) {
        return Category.findByIdAndUpdate(id, updateData, { new: true });
    }
}

module.exports = new CategoryRepository();
