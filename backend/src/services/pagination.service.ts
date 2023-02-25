class PaginationService {
    public createSkip(page: number, perPage: number): number {
        return perPage * (page - 1);
    }
}

export const paginationService = new PaginationService();
