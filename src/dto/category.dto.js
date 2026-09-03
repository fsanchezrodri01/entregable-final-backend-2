export class CategoryDTO {
  constructor(category) {
    this.id = category._id?.toString() ?? category.id;
    this.name = category.name;
    this.slug = category.slug;
    this.description = category.description;
  }

  static fromList(categories = []) {
    return categories.map(category => new CategoryDTO(category));
  }
}

export default CategoryDTO;
