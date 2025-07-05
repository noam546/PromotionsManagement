import styles from './PromotionsFilters.module.scss';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import dayjs from "dayjs";

interface PromotionsFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  promotionTypes: Array<{ value: string; label: string }>;
}

export default function PromotionsFilters({ 
  search, 
  setSearch, 
  type, 
  setType, 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate, 
  applyFilters, 
  clearFilters,
  promotionTypes 
}: PromotionsFiltersProps) {
  return (
        <div className={styles.container}>
          <div className={styles.searchInput}>
            <input
              type="text"
              placeholder="Search text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Type Filter */}
          <div className={styles.typeFilter}>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={styles.input}
            >
              <option value="">All Types</option>
              {promotionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.startDate}>
              <DatePicker
                label="Start Date"
                value={startDate ? dayjs(startDate) : null}
                onChange={(newValue) => {
                  setStartDate(newValue ? newValue.format('YYYY-MM-DD') : '');
                }}
                slots={{ textField: TextField }}
                slotProps={{
                  textField: {
                    className: styles.input,
                    fullWidth: true,
                    variant: "outlined",
                    placeholder: "Start Date",
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        backgroundColor: 'transparent',
                        color: 'inherit',
                        height: '38px',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'inherit',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        left: '12px',
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#fff',
                      },
                    },
                    InputProps: {
                      style: { height: '40px', padding: '8px 12px', border: '1px solid rgb(154, 154, 154)' },
                    }
                  },
                }}
                enableAccessibleFieldDOMStructure={false}
              />
            </div>
          </LocalizationProvider>

          {/* End Date */}
          <div className={styles.endDate}>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.input}
            />
          </div>

        <button
            onClick={applyFilters}
            className={styles.applyButton}
          >
            Apply
          </button>
          <button
            onClick={clearFilters}
            className={styles.button}
          >
            Clear
          </button>
          
      </div>
  );
} 