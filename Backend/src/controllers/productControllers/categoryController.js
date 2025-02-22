const {categoryService} = require("../../services/index");
const AppError = require("../../utils/error.utils");

class CategoryController {
    
    static async addCategory(req, res, next) {
        try {
            const message = await categoryService.addCategory(req.body);
            res.status(201).json({ success: true, message });
        } catch (error) {
            if (error.code === 11000) {
                return next(new AppError("Category already exists", 400));
            }
            next(error);
        }
    }


    static async getCategories(req, res, next) {
        try {
            const categories = await categoryService.getCategories();
            res.status(200).json({ success: true, categories });
        } catch (error) {
            next(error);
        }
    }


    static async getCategoryById(req, res, next) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            if (!category) {
                return next(new AppError("Category not found", 404));
            }
            res.status(200).json({ success: true, category });
        } catch (error) {
            next(error);
        }
    }

    static async deleteCategory(req, res, next) {
        try {
            // const deleted = await categoryService.deleteCategory(req.params.id);
            const deleted = await categoryService.deleteCategory(req.body.id);

            if (!deleted) {
                return next(new AppError("Category not found", 404));
            }
            res.status(200).json({ success: true, message: "Category and its subcategories deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CategoryController;
