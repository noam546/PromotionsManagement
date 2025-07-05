import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from '@mui/icons-material/Search';
import { MenuItem, FormControl } from "@mui/material";
import dayjs from "dayjs";
import {
  Container,
  SearchInput,
  SearchIconContainer,
  TypeSelect,
  DatePickerContainer,
  StyledDatePicker,
  ApplyButton,
  ClearButton
} from './promotionsFilters.styled';

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
      <Container>
        {/* Search Input */}
        <div>
          <SearchInput
            type="text"
            placeholder="Search text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <SearchIconContainer>
                  <SearchIcon />
                </SearchIconContainer>
              ),
            }}
          />
        </div>

        {/* Type Filter */}
        <div>
          <FormControl fullWidth>
            <TypeSelect
              value={type}
              onChange={(e) => setType(e.target.value as string)}
              displayEmpty
              variant="outlined"
            >
              <MenuItem value="">All Types</MenuItem>
              {promotionTypes.map(type => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TypeSelect>
          </FormControl>
        </div>

        {/* Start Date */}
        <DatePickerContainer>
          <StyledDatePicker
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
              }
            }}
          />
        </DatePickerContainer>

        {/* End Date */}
        <DatePickerContainer>
          <StyledDatePicker
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
              }
            }}
          />
        </DatePickerContainer>

        <ApplyButton
          onClick={applyFilters}
          variant="contained"
        >
          Apply
        </ApplyButton>
        
        <ClearButton
          onClick={clearFilters}
          variant="outlined"
        >
          Clear
        </ClearButton>
      </Container>
    </LocalizationProvider>
  );
} 