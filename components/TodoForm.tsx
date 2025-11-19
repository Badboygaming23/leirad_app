
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Calendar, Loader2, X, Flag, Briefcase, BookOpen, User, Heart, DollarSign, Layers, CalendarClock, ChevronRight, Check } from 'lucide-react';
import { AddToastFunction, ToastType, Priority, Category } from '../types';

interface TodoFormProps {
  onAdd: (text: string, dueDate: number | undefined, priority: Priority, category: Category) => void;
  addToast: AddToastFunction;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAdd, addToast }) => {
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('general');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false); // New state for dropdown
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Close category dropdown if clicked outside
  const categoryRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
              setIsCategoryOpen(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      addToast("Please enter a task description.", ToastType.WARNING);
      return;
    }
    
    setIsSubmitting(true);

    // Simulate network request/processing time for better UX feedback
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let timestamp: number | undefined;
    if (dueDate) {
        const dateObj = new Date(dueDate);
        if (!isNaN(dateObj.getTime())) {
            timestamp = dateObj.getTime();
        }
    }
    
    onAdd(input.trim(), timestamp, priority, category);
    setInput('');
    setDueDate('');
    setPriority('medium');
    setCategory('general');
    setIsExpanded(false);
    setIsSubmitting(false);
    setIsCategoryOpen(false);
  };

  const clearDate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDueDate('');
  };

  const getFormattedDate = () => {
    if (!dueDate) return '';
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    
    if (isToday) return `Today • ${time}`;
    if (isTomorrow) return `Tomorrow • ${time}`;

    const day = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return `${day} • ${time}`;
  };

  // Robust manual formatting to avoid timezone issues with toISOString
  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const categories: { id: Category; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'general', label: 'General', icon: <Layers className="w-4 h-4" />, color: 'bg-gray-100 text-gray-600' },
    { id: 'work', label: 'Work', icon: <Briefcase className="w-4 h-4" />, color: 'bg-slate-100 text-slate-600' },
    { id: 'study', label: 'Study', icon: <BookOpen className="w-4 h-4" />, color: 'bg-purple-100 text-purple-600' },
    { id: 'personal', label: 'Personal', icon: <User className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'health', label: 'Health', icon: <Heart className="w-4 h-4" />, color: 'bg-rose-100 text-rose-600' },
    { id: 'finance', label: 'Finance', icon: <DollarSign className="w-4 h-4" />, color: 'bg-amber-100 text-amber-600' },
  ];

  const activeCategory = categories.find(c => c.id === category);

  return (
    <form onSubmit={handleSubmit} className="relative group z-30">
      {/* CSS to expand the calendar click target to 100% of the input */}
      <style>{`
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          color: transparent;
          background: transparent;
          cursor: pointer;
        }
      `}</style>

      <div className={`
        relative flex flex-col bg-white rounded-3xl shadow-xl shadow-indigo-500/10 border border-slate-100
        transition-all duration-300 overflow-visible
        ${isExpanded || input ? 'pb-3 scale-100 ring-4 ring-indigo-500/10' : 'pb-0 scale-[0.99] hover:scale-100'}
      `}>
        
        {/* Top Row: Input */}
        <div className="flex items-center p-2 pr-2">
            <div className="flex-1 relative">
                <input
                type="text"
                value={input}
                onFocus={() => setIsExpanded(true)}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What needs to be done?"
                disabled={isSubmitting}
                className="w-full pl-5 py-4 text-lg bg-transparent border-none focus:ring-0 focus:outline-none placeholder-slate-400 text-slate-800 font-medium disabled:opacity-50"
                />
            </div>
            
            <button
                type="submit"
                disabled={isSubmitting || !input.trim()}
                className={`
                    h-12 w-12 rounded-2xl transition-all duration-300 flex-shrink-0 flex items-center justify-center ml-2
                    ${isSubmitting || !input.trim() 
                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 active:scale-95'
                    }
                `}
                aria-label="Add Task"
                >
                {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <Plus className="w-6 h-6" />
                )}
            </button>
        </div>

        {/* Bottom Row: Metadata Controls (Collapsible) */}
        <div className={`
            px-5 flex flex-wrap items-center gap-2 transition-all duration-300 origin-top relative
            ${isExpanded || input ? 'opacity-100 max-h-40 translate-y-0' : 'opacity-0 max-h-0 -translate-y-4 pointer-events-none'}
        `}>
            
            {/* Pill 1: Date Picker */}
            <div className="relative group/date">
                <div className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 cursor-pointer select-none
                    ${dueDate 
                        ? 'bg-indigo-50 border-indigo-100 text-indigo-600' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300 hover:shadow-sm'}
                `}>
                    <CalendarClock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="whitespace-nowrap">
                        {dueDate ? getFormattedDate() : 'Set Due Date'}
                    </span>
                    {dueDate && (
                        <button 
                            type="button"
                            onClick={clearDate}
                            className="ml-1 p-0.5 hover:bg-indigo-100 rounded-full text-indigo-400 hover:text-indigo-700 z-20 relative"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>

                {/* Invisible Input Overlay */}
                <input
                    type="datetime-local"
                    value={dueDate}
                    min={getMinDateTime()}
                    onChange={(e) => setDueDate(e.target.value)}
                    disabled={isSubmitting}
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                    aria-label="Select due date"
                />
            </div>

            {/* Pill 2: Category Custom Dropdown */}
            <div className="relative" ref={categoryRef}>
                <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none border
                        ${isCategoryOpen 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' 
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300 hover:shadow-sm'}
                    `}
                >
                    {activeCategory?.icon}
                    <span>{activeCategory?.label}</span>
                    <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isCategoryOpen ? '-rotate-90' : 'rotate-90'}`} />
                </button>
                
                {/* Dropdown Menu */}
                {isCategoryOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-indigo-500/10 border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2 mb-1">Select Category</div>
                        <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => {
                                        setCategory(cat.id);
                                        setIsCategoryOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                                        ${category === cat.id 
                                            ? 'bg-indigo-50 text-indigo-600' 
                                            : 'text-slate-600 hover:bg-slate-50'}
                                    `}
                                >
                                    <div className={`p-1.5 rounded-lg ${cat.color.split(' ')[0]} ${cat.color.split(' ')[1]}`}>
                                        {cat.icon}
                                    </div>
                                    <span className="flex-1 text-left">{cat.label}</span>
                                    {category === cat.id && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="w-px h-4 bg-slate-200 mx-1"></div>

            {/* Pill 3: Priority */}
             <div className="flex items-center bg-slate-50 rounded-full border border-slate-200 p-0.5">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`
                            px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all duration-200
                            ${priority === p 
                                ? p === 'high' ? 'bg-white text-rose-600 shadow-sm ring-1 ring-rose-100' 
                                : p === 'medium' ? 'bg-white text-amber-600 shadow-sm ring-1 ring-amber-100'
                                : 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-100'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}
                        `}
                    >
                        {p}
                    </button>
                ))}
            </div>

        </div>
      </div>
    </form>
  );
};

export default TodoForm;
