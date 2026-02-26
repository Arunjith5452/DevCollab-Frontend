"use client";
import React, { useEffect, useState } from 'react';
import DatePicker, { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomDatePickerProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    showTimeSelect?: boolean;
    showTimeSelectOnly?: boolean;
    timeIntervals?: number;
    dateFormat?: string;
    placeholderText?: string;
    minDate?: Date;
    label?: string;
    required?: boolean;
    error?: string;
}

export default function CustomDatePicker({
    selected,
    onChange,
    showTimeSelect = false,
    showTimeSelectOnly = false,
    timeIntervals = 15,
    dateFormat,
    placeholderText = "Select date",
    minDate,
    label,
    required = false,
    error
}: CustomDatePickerProps) {

    const format = dateFormat || (showTimeSelectOnly ? "h:mm aa" : showTimeSelect ? "MMMM d, yyyy h:mm aa" : "MMMM d, yyyy");

    const [selectedHour, setSelectedHour] = useState<number>(selected ? (selected.getHours() % 12 || 12) : 12);
    const [selectedMinute, setSelectedMinute] = useState<number>(selected ? selected.getMinutes() : 0);
    const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(selected ? (selected.getHours() >= 12 ? "PM" : "AM") : "AM");

    useEffect(() => {
        if (selected) {
            setSelectedHour(selected.getHours() % 12 || 12);
            setSelectedMinute(selected.getMinutes());
            setSelectedPeriod(selected.getHours() >= 12 ? "PM" : "AM");
        }
    }, [selected]);

    const handleTimeChange = (type: "hour" | "minute" | "period", value: number | string) => {
        const currentDate = selected || new Date(); // Default to today if date is null
        let newHour = selectedHour;
        let newMinute = selectedMinute;
        let newPeriod = selectedPeriod;

        if (type === "hour") newHour = value as number;
        if (type === "minute") newMinute = value as number;
        if (type === "period") newPeriod = value as "AM" | "PM";

        if (type === "hour") setSelectedHour(newHour);
        if (type === "minute") setSelectedMinute(newMinute);
        if (type === "period") setSelectedPeriod(newPeriod);

        let hour24 = newHour;
        if (newPeriod === "PM" && newHour !== 12) hour24 += 12;
        if (newPeriod === "AM" && newHour === 12) hour24 = 0;

        const newDate = new Date(currentDate);
        newDate.setHours(hour24);
        newDate.setMinutes(newMinute);

        onChange(newDate);
    };

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 / timeIntervals }, (_, i) => i * timeIntervals);
    const periods = ["AM", "PM"];

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 text-gray-400">
                    {showTimeSelectOnly ? <Clock size={16} /> : <Calendar size={16} />}
                </div>
                <DatePicker
                    selected={selected}
                    onChange={(date: Date | null) => {
                        if (!date) {
                            onChange(null);
                            return;
                        }

                        let hour24 = selectedHour;
                        if (selectedPeriod === "PM" && selectedHour !== 12) hour24 += 12;
                        if (selectedPeriod === "AM" && selectedHour === 12) hour24 = 0;

                        const newDate = new Date(date);
                        newDate.setHours(hour24);
                        newDate.setMinutes(selectedMinute);
                        onChange(newDate);
                    }}
                    showTimeSelect={false}
                    showTimeSelectOnly={showTimeSelectOnly}
                    timeIntervals={timeIntervals}
                    dateFormat={format}
                    placeholderText={placeholderText}
                    minDate={minDate}
                    className={`
                        w-full pl-10 pr-4 py-3 rounded-lg border outline-none transition-all
                        ${error ? 'border-red-300 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent'}
                        text-gray-900 placeholder-gray-400 bg-white shadow-sm
                    `}
                    calendarClassName="!font-sans !border-0 !shadow-xl !rounded-xl !overflow-hidden"
                    wrapperClassName="w-full"
                    popperClassName="!z-50"
                    showPopperArrow={false}
                    renderCustomHeader={(props: ReactDatePickerCustomHeaderProps) => {
                        const {
                            date,
                            decreaseMonth,
                            increaseMonth,
                            prevMonthButtonDisabled,
                            nextMonthButtonDisabled,
                        } = props;

                        return showTimeSelectOnly ? (
                            <div style={{ display: 'none' }} />
                        ) : (
                            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                                <button
                                    onClick={decreaseMonth}
                                    disabled={prevMonthButtonDisabled}
                                    type="button"
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30"
                                >
                                    <ChevronLeft size={18} className="text-gray-600" />
                                </button>
                                <span className="text-sm font-bold text-gray-800">
                                    {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </span>
                                <button
                                    onClick={increaseMonth}
                                    disabled={nextMonthButtonDisabled}
                                    type="button"
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30"
                                >
                                    <ChevronRight size={18} className="text-gray-600" />
                                </button>
                            </div>
                        )
                    }}
                    calendarContainer={({ className, children }) => (
                        <div className={`${className} flex flex-col bg-white rounded-xl overflow-hidden shadow-xl border border-gray-100`}>
                            {/* Render Calendar unless in time-only mode */}
                            {!showTimeSelectOnly && children}

                            {/* Custom Time Selector */}
                            {(showTimeSelect || showTimeSelectOnly) && (
                                <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">
                                        Select Time
                                    </div>
                                    <div className="flex justify-center gap-2 h-32">
                                        {/* Hours Column */}
                                        <div className="flex flex-col overflow-y-auto no-scrollbar w-14 bg-white rounded-lg shadow-sm border border-gray-100">
                                            {hours.map(h => (
                                                <button
                                                    key={h}
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); handleTimeChange("hour", h); }}
                                                    className={`
                                                        py-2 text-sm font-medium transition-colors hover:bg-teal-50 flex-shrink-0
                                                        ${selectedHour === h ? 'bg-teal-500 text-white hover:bg-teal-600' : 'text-gray-700'}
                                                    `}
                                                >
                                                    {h}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex items-center text-gray-300 font-bold">:</div>

                                        {/* Minutes Column */}
                                        <div className="flex flex-col overflow-y-auto no-scrollbar w-14 bg-white rounded-lg shadow-sm border border-gray-100">
                                            {minutes.map(m => (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); handleTimeChange("minute", m); }}
                                                    className={`
                                                        py-2 text-sm font-medium transition-colors hover:bg-teal-50 flex-shrink-0
                                                        ${selectedMinute === m ? 'bg-teal-500 text-white hover:bg-teal-600' : 'text-gray-700'}
                                                    `}
                                                >
                                                    {m.toString().padStart(2, '0')}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Period Column */}
                                        <div className="flex flex-col no-scrollbar w-14 bg-white rounded-lg shadow-sm border border-gray-100">
                                            {periods.map(p => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); handleTimeChange("period", p); }}
                                                    className={`
                                                        flex-1 py-1 text-xs font-bold transition-colors hover:bg-teal-50
                                                        ${selectedPeriod === p ? 'bg-teal-500 text-white hover:bg-teal-600' : 'text-gray-700'}
                                                    `}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                />
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

                <style jsx global>{`
                .react-datepicker {
                    font-family: inherit;
                    border: none;
                    box-shadow: none;
                }
                .react-datepicker__header {
                    background-color: white;
                    border-bottom: 1px solid #f3f4f6;
                    padding-top: 10px;
                }
                .react-datepicker__day-name {
                    color: #9ca3af;
                    font-weight: 600;
                    width: 2.5rem;
                    line-height: 2.5rem;
                    margin: 0;
                }
                .react-datepicker__day {
                    width: 2.5rem;
                    line-height: 2.5rem;
                    margin: 0;
                    border-radius: 0.5rem;
                    color: #374151;
                }
                .react-datepicker__day:hover {
                    background-color: #f3f4f6;
                }
                .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
                    background-color: #0d9488 !important;
                    color: white !important;
                    font-weight: 600;
                }
                .react-datepicker__day--today {
                    font-weight: bold;
                    color: #0d9488;
                }
                /* Hide scrollbar for custom lists */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            </div>
        </div>
    );
}
