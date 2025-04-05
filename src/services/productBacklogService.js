import api from "./api"

export const productBacklogService = {
  /**
   * Add a new product backlog
   * @param {Object} productBacklogDTO - Product backlog data
   * @returns {Promise} - Promise with created product backlog
   */
  addProductBacklog: (productBacklogDTO) => api.post("/api/productbacklogs", productBacklogDTO),

  /**
   * Delete a product backlog
   * @param {number} id - Product backlog ID
   * @returns {Promise} - Promise with deleted product backlog
   */
  deleteProductBacklog: (id) => api.delete(`/api/productbacklogs/${id}`),

  /**
   * Update a product backlog
   * @param {number} id - Product backlog ID
   * @param {Object} productBacklogDTO - Updated product backlog data
   * @returns {Promise} - Promise with updated product backlog
   */
  updateProductBacklog: (id, productBacklogDTO) => api.put(`/api/productbacklogs/${id}`, productBacklogDTO),

  /**
   * Get all product backlogs
   * @returns {Promise} - Promise with product backlogs list
   */
  getAllProductBacklogs: () => api.get("/api/productbacklogs"),

  /**
   * Get product backlogs by project
   * @param {number} projectId - Project ID
   * @returns {Promise} - Promise with product backlogs list
   */
  getProductBacklogsByProject: (projectId) => api.get(`/api/productbacklogs/project/${projectId}`),

  /**
   * Get product backlog by title
   * @param {string} title - Product backlog title
   * @returns {Promise} - Promise with product backlog data
   */
  getProductBacklogByTitle: (title) => api.get(`/api/productbacklogs/title/${title}`),
}

