import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDown, Calendar } from 'lucide-react';
import { useOnClickOutside } from '@/shared/hooks/useOnClickOutside';

interface DashboardDateFilterProps {
    onFilterChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

type FilterOption = 'today' | 'week' | 'month' | 'year' | 'all' | 'custom';

const DashboardDateFilter: React.FC<DashboardDateFilterProps> = ({ onFilterChange }) => {
    const [selectedOption, setSelectedOption] = useState<FilterOption>('all');
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCustomPickerOpen, setIsCustomPickerOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(dropdownRef as React.RefObject<HTMLDivElement>, () => {
        setIsDropdownOpen(false);
        setIsCustomPickerOpen(false);
    });

    const handleOptionSelect = (option: FilterOption) => {
        setSelectedOption(option);
        setIsDropdownOpen(false);

        const now = new Date();
        let start: Date | undefined;
        let end: Date | undefined = new Date(now);

        switch (option) {
            case 'today':
                start = new Date(now.setHours(0, 0, 0, 0));
                end = new Date(now.setHours(23, 59, 59, 999));
                break;
            case 'week':
                const day = now.getDay();
                const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
                const monday = new Date(now);
                monday.setDate(diff);
                monday.setHours(0, 0, 0, 0);
                start = monday;
                end = new Date(); // End is current time
                break;
            case 'month':
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date();
                break;
            case 'year':
                start = new Date(now.getFullYear(), 0, 1);
                end = new Date();
                break;
            case 'all':
                start = undefined;
                end = undefined;
                break;
            case 'custom':
                setIsCustomPickerOpen(true);
                return; // Do not trigger callback yet
        }

        onFilterChange(start, end);
    };

    const handleCustomDateChange = (update: [Date | null, Date | null]) => {
        setDateRange(update);
        const [start, end] = update;
        if (start && end) {
            onFilterChange(start, end);
            setIsCustomPickerOpen(false);
        }
    };

    const getLabel = () => {
        switch (selectedOption) {
            case 'today': return 'Today';
            case 'week': return 'This Week';
            case 'month': return 'This Month';
            case 'year': return 'This Year';
            case 'all': return 'All Time';
            case 'custom': return startDate && endDate
                ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                : 'Custom Range';
            default: return 'Filter Date';
        }
    };

    return (
        <div className="relative inline-block text-left z-20" ref={dropdownRef}>
            <div>
                <button
                    type="button"
                    className={`inline-flex justify-between items-center w-full rounded-lg border shadow-sm px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 ${isDropdownOpen
                        ? 'bg-[#f0fdfa] border-[#0d9488] text-[#0f766e]'
                        : 'bg-white border-[#e6f4f2] text-[#0c1d1a] hover:bg-gray-50 hover:border-[#cbd5e1]'
                        }`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <Calendar className={`mr-2 h-4 w-4 transition-colors duration-200 ${isDropdownOpen ? 'text-[#0d9488]' : 'text-[#64748b]'}`} />
                    <span className="truncate">{getLabel()}</span>
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180 text-[#0d9488]' : 'text-[#94a3b8]'}`} aria-hidden="true" />
                </button>
            </div>

            {isDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white border border-[#e2e8f0] focus:outline-none z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        {['all', 'today', 'week', 'month', 'year', 'custom'].map((option) => (
                            <button
                                key={option}
                                className={`block w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${selectedOption === option
                                    ? 'bg-[#f0fdfa] text-[#0f766e] font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={() => handleOptionSelect(option as FilterOption)}
                            >
                                {option === 'all' ? 'All Time' : option.charAt(0).toUpperCase() + option.slice(1).replace('week', ' Week').replace('month', ' Month').replace('year', ' Year')}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isCustomPickerOpen && (
                <div className="absolute right-0 mt-2 bg-white p-4 shadow-xl rounded-xl border border-[#e2e8f0] z-50 animate-in fade-in zoom-in-95 duration-100">
                    <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={handleCustomDateChange}
                        inline
                    />
                    <div className="text-right mt-2">
                        <button
                            className="text-xs font-medium text-[#64748b] hover:text-[#0f766e] transition-colors"
                            onClick={() => setIsCustomPickerOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardDateFilter;
