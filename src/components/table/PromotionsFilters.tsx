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
      enableAccessibleFieldDOMStructure={false}
      slots={{ textField: TextField }}
      slotProps={{
        textField: {
          className: styles.input,
          fullWidth: true,
          variant: "outlined",
          InputProps: {
            style: { height: "40px" },
          },
          inputProps: {
            style: { padding: "8px 12px" },
          },
        },
      }}
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