/** API response envelope for list endpoints (projects, skills, experience) */
export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/** API response envelope for single-item endpoints */
export interface ApiItemResponse<T> {
  success: boolean;
  data: T;
}
