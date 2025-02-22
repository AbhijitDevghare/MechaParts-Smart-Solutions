const {categoryRepository} = require("../../repositories/index");
const AppError = require("../../utils/error.utils");

class CategoryService {
    
    async addCategory(categoryData) {
        const { name } = categoryData;
        if (!name) {
            throw new AppError("Category name is required", 400);
        }

        const isCategoryExist = await categoryRepository.findCategoryByName(name);
        if (isCategoryExist) {
            throw new AppError("Category already exists", 400);
        }

        const category = await categoryRepository.createCategory(categoryData);
        if (!category) {
            throw new AppError("Unable to add category", 500);
        }

        return "Category added successfully";
    }


    async getCategories() {
        return await categoryRepository.getAllCategories();
    }


    async getCategoryById(id) {
        return await categoryRepository.findCategoryById(id);
    }


    async deleteCategory(id) {
        return await categoryRepository.deleteCategory(id);  
    }
    
}

module.exports = new CategoryService();
