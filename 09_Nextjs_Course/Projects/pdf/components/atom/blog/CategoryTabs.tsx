'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export function CategoryTabs({
    categories,
    activeCategory,
    onCategoryChange,
}: CategoryTabsProps) {
    return (
        <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
                <Button
                    key={category}
                    variant={activeCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onCategoryChange(category)}
                    className={cn(
                        ' px-5',
                        activeCategory === category && 'shadow-md'
                    )}>
                    {category}
                </Button>
            ))}
        </div>
    );
}
