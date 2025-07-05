import styled from 'styled-components';
import { TextField, Select, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const Container = styled.div`
  align-self: flex-start;
  display: flex;
  flex-flow: row;
  gap: 15px;
  margin-left: 9px;
  align-items: flex-end;
  padding-right: 24px;
`;

export const SearchInput = styled(TextField)`
  & .MuiOutlinedInput-root {
    height: 40px;
    border-radius: 28px;
    background-color: transparent;
    color: #fff;
    
    .MuiOutlinedInput-notchedOutline {
      border-color: rgb(154, 154, 154);
    }
    
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: rgb(154, 154, 154);
    }
    
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: rgb(154, 154, 154);
    }
  }
  
  & .MuiInputBase-input {
    padding: 0 14px;
    line-height: 40px;
    color: #fff;
  }
  
  & input::placeholder {
    color: #fff;
    opacity: 1;
  }
`;

export const SearchIconContainer = styled.div`
  display: flex;
`;

export const TypeSelect = styled(Select)`
  background-color: transparent !important;
  border-radius: 28px !important;
  color: #fff !important;
  height: 40px !important;
  min-width: 150px !important;
  border: 1px solid rgb(154, 154, 154) !important;
  
  .MuiOutlinedInput-notchedOutline {
    border: 1px solid rgb(154, 154, 154) !important;
  }
  
  &:hover .MuiOutlinedInput-notchedOutline {
    border: 1px solid rgb(154, 154, 154) !important;
  }
  
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 1px solid rgb(154, 154, 154) !important;
  }
  
  .MuiSelect-icon {
    color: #fff !important;
  }
  
  .MuiSelect-select {
    color: #fff !important;
  }
`;

export const DatePickerContainer = styled.div`
  min-width: 100px;
  max-width: 200px;
`;

export const StyledDatePicker = styled(DatePicker)`
  & .MuiOutlinedInput-root {
    height: 40px;
    background-color: transparent;
    color: #fff;
    border-radius: 28px;
    padding-right: 8px;
    align-items: center;
    
    fieldset {
      border-color: #fff;
    }
    
    &:hover fieldset {
      border-color: #fff;
    }
    
    &.Mui-focused fieldset {
      border-color: #fff;
    }
  }
  
  & .MuiInputBase-input {
    padding: 0;
    padding-left: 14px;
    font-size: 14px;
    color: #fff;
    display: flex;
    align-items: center;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
  }

  '& .MuiFormLabel-root-MuiInputLabel-root.Mui-focused': {
    color: '#00bcd4',
  },
  
  & .MuiInputLabel-root {
    top: -6px;
    color: #fff;
    font-size: 14px;
  }
  
  & .MuiSvgIcon-root {
    color: #fff;
  }
  
  & .MuiInputAdornment-root {
    padding-right: 8px;
  }
`;

export const ApplyButton = styled(Button)`
  padding: 10px 20px !important;
  background-color: #007AFF !important;
  border-radius: 28px !important;
  color: #fff !important;
  font-size: 14px !important;
  height: 40px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  
  &:hover {
    background-color: #2d93ff !important;
  }
`;

export const ClearButton = styled(Button)`
  padding: 10px 20px !important;
  border: 1px solid rgb(154, 154, 154) !important;
  background-color: transparent ;
  color: #fff !important;
  font-size: 14px ;
  height: 40px ;
  border-radius: 28px !important;
  text-transform: none !important;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid rgb(154, 154, 154) ;
  }
`; 