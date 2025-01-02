import {Pagination, PaginationContent, PaginationItem, PaginationLink} from "@/components/ui/pagination.tsx";

interface PaginatedPlanetsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const PaginatedPlanets = ({ currentPage, totalPages, onPageChange }: PaginatedPlanetsProps) => {
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationLink
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        isActive={false}
                    >
                        Previous
                    </PaginationLink>
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={() => onPageChange(i + 1)}
                            isActive={currentPage === i + 1}
                        >
                            {i + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationLink
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        isActive={false}
                    >
                        Next
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};