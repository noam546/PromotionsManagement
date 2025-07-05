import styles from './PromotionsFilters.module.scss';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import { TextField, Select, MenuItem, Button, FormControl, InputLabel } from "@mui/material";
import dayjs from "dayjs";
import { SearchIcon } from "../icons";

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
      <div className={styles.container}>
        {/* Search Input */}
        <div >
          <TextField
            type="text"
            placeholder="Search text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              style: {
                height: '40px',
                backgroundColor: 'transparent',
                color: '#fff',
                border: '1px solid rgb(154, 154, 154)',
              }
            }}
          />
        </div>

        {/* Type Filter */}
        <div >
          <FormControl fullWidth>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              displayEmpty
              variant="outlined"
              sx={{
                backgroundColor: 'transparent',
                color: '#fff',
                height: '40px',
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
              <MenuItem value="" >All Types</MenuItem>
              {promotionTypes.map(type => (
                <MenuItem key={type.value} value={type.value} >
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Start Date */}
        <div className={styles.startDate}>
          <DatePicker
            label="Start Date"
            value={startDate ? dayjs(startDate) : null}
            onChange={(newValue) => {
              setStartDate(newValue ? newValue.format('YYYY-MM-DD') : '');
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
                sx: {
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '28px',
                    backgroundColor: 'transparent',
                    color: '#fff',
                    height: '40px',
                    '& fieldset': {
                      border: '1px solid rgb(154, 154, 154)',
                    },
                    '&:hover fieldset': {
                      border: '1px solid rgb(154, 154, 154)',
                    },
                    '&.Mui-focused fieldset': {
                      border: '1px solid rgb(154, 154, 154)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#fff',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#fff',
                  },
                }
              },
            }}
          />
        </div>

        {/* End Date */}
        <div className={styles.endDate}>
          <DatePicker
            label="End Date"
            value={endDate ? dayjs(endDate) : null}
            onChange={(newValue) => {
              setEndDate(newValue ? newValue.format('YYYY-MM-DD') : '');
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
                sx: {
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '28px',
                    backgroundColor: 'transparent',
                    color: '#fff',
                    height: '40px',
                    '& fieldset': {
                      border: '1px solid rgb(154, 154, 154)',
                    },
                    '&:hover fieldset': {
                      border: '1px solid rgb(154, 154, 154)',
                    },
                    '&.Mui-focused fieldset': {
                      border: '1px solid rgb(154, 154, 154)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#fff',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#fff',
                  },
                }
              },
            }}
          />
        </div>

        <Button
          onClick={applyFilters}
          variant="contained"
          sx={{
            padding: '10px 20px',
            backgroundColor: '#007AFF',
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