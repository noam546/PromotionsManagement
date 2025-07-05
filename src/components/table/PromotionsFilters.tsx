import styles from './PromotionsFilters.module.scss';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from '@mui/icons-material/Search';
import { TextField, Select, MenuItem, Button, FormControl } from "@mui/material";
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={styles.container} style={{ paddingRight: '24px' }}>
        {/* Search Input */}
        <div>
          <TextField
            type="text"
            placeholder="Search text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <div className={styles.searchIconContainer}>
                  <SearchIcon />
                </div>
              ),
              sx: {
                height: '40px',
                borderRadius: '28px',
                backgroundColor: 'transparent',
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(154, 154, 154)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(154, 154, 154)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgb(154, 154, 154)',
                },
                '& input::placeholder': {
                  color: '#fff',
                  opacity: 1,
                },
              },
            }}
            sx={{
              '& .MuiInputBase-input': {
                padding: '0 14px',
                lineHeight: '40px',
                color: '#fff',
              },
            }}
          />
        </div>

        {/* Type Filter */}
        <div>
          <FormControl fullWidth>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              displayEmpty
              variant="outlined"
              sx={{
                backgroundColor: 'transparent',
                borderRadius: '28px',
                color: '#fff',
                height: '40px',
                minWidth: '150px',
                border: '1px solid rgb(154, 154, 154) !important',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid rgb(154, 154, 154)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid rgb(154, 154, 154)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid rgb(154, 154, 154)',
                },
                '& .MuiSelect-icon': {
                  color: '#fff',
                },
              }}
            >
              <MenuItem value="">All Types</MenuItem>
              {promotionTypes.map(type => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Start Date */}
        <div className={styles.datePicker}>
          <DatePicker
            label="Start Date"
            value={startDate ? dayjs(startDate) : null}
            onChange={(newValue) => {
              setStartDate(newValue ? newValue.format('YYYY-MM-DD') : '');
            }}
            enableAccessibleFieldDOMStructure={false} 
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
                sx: {
                  '& .MuiOutlinedInput-root': {
                    height: '40px',
                    backgroundColor: 'transparent',
                    color: '#fff',
                    borderRadius: '28px',
                    paddingRight: '8px',
                    alignItems: 'center',
                    '& fieldset': {
                      borderColor: '#fff',
                    },
                    '&:hover fieldset': {
                      borderColor: '#fff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fff',
                    },
                  },
                  '& .MuiInputBase-input': {
                    padding: 0,
                    paddingLeft: '14px',
                    fontSize: '14px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    height: '40px',
                    lineHeight: '40px',
                    boxSizing: 'border-box',
                  },
                  '& .MuiInputLabel-root': {
                    top: '-6px',
                    color: '#fff',
                    fontSize: '14px',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#fff',
                  },
                  '& .MuiInputAdornment-root': {
                    paddingRight: '8px', 
                  },
                }
              }
            }}
          />
        </div>

        {/* End Date */}
        <div className={styles.datePicker}>
          <DatePicker
            label="End Date"
            value={endDate ? dayjs(endDate) : null}
            onChange={(newValue) => {
              setEndDate(newValue ? newValue.format('YYYY-MM-DD') : '');
            }}
            enableAccessibleFieldDOMStructure={false}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
                sx: {
                  '& .MuiOutlinedInput-root': {
                    height: '40px',
                    backgroundColor: 'transparent',
                    color: '#fff',
                    borderRadius: '28px',
                    paddingRight: '8px',
                    alignItems: 'center',
                    '& fieldset': {
                      borderColor: '#fff',
                    },
                    '&:hover fieldset': {
                      borderColor: '#fff',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fff',
                    },
                  },
                  '& .MuiInputBase-input': {
                    padding: 0,
                    paddingLeft: '14px',
                    fontSize: '14px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    height: '40px',
                    lineHeight: '40px',
                    boxSizing: 'border-box',
                  },
                  '& .MuiInputLabel-root': {
                    top: '-6px',
                    color: '#fff',
                    fontSize: '14px',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#fff',
                  },
                  '& .MuiInputAdornment-root': {
                    paddingRight: '8px', 
                  },
                }
              }
            }}
          />
        </div>

        <Button
          onClick={applyFilters}
          variant="contained"
          sx={{
            padding: '10px 20px',
            backgroundColor: '#007AFF',
            borderRadius: '28px',
            color: '#fff',
            fontSize: '14px',
            height: '40px',
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#2d93ff',
            },
          }}
        >
          Apply
        </Button>
        
        <Button
          onClick={clearFilters}
          variant="outlined"
          sx={{
            padding: '10px 20px',
            border: '1px solid rgb(154, 154, 154)',
            backgroundColor: 'transparent',
            color: '#fff',
            fontSize: '14px',
            height: '40px',
            borderRadius: '28px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgb(154, 154, 154)',
            },
          }}
        >
          Clear
        </Button>
      </div>
    </LocalizationProvider>
  );
} 