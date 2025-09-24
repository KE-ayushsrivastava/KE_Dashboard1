import React, { useMemo, useCallback } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Typography,
} from "@mui/material";

export default function Filters({
  label,
  options,
  selected,
  setSelected,
  field,
  width = 130,
  menuHeight = 260,
}) {
  const allValues = useMemo(
    () => options.map((opt) => (typeof opt === "string" ? opt : opt.value)),
    [options]
  );

  const labelFor = (opt) => (typeof opt === "string" ? opt : opt.label);
  const sel = Array.isArray(selected) ? selected : [];

  const labelId = `${field || label}-label`;
  const selectId = `${field || label}-select`;

  const MenuProps = {
    PaperProps: {
      style: { maxHeight: menuHeight, width: width + 20 },
    },
    anchorOrigin: { vertical: "bottom", horizontal: "left" },
    transformOrigin: { vertical: "top", horizontal: "left" },
  };

  const handleChange = useCallback(
    (event) => {
      const {
        target: { value },
      } = event;

      let newVal;
      if (Array.isArray(value)) newVal = value;
      else if (typeof value === "string") newVal = value.split(",");
      else newVal = [value];

      if (newVal.includes("__ALL__")) {
        setSelected((prev) => {
          const prevArr = Array.isArray(prev) ? prev : [];
          return prevArr.length === allValues.length ? [] : [...allValues];
        });
        return;
      }
      console.log("Filter change:", field, newVal); // 👈 Debug log
      setSelected(newVal);
    },
    [allValues, setSelected]
  );

  return (
    <FormControl sx={{ width }}>
      <InputLabel id={labelId} sx={{ fontSize: 12, top: -8 }}>
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        id={selectId}
        multiple
        value={sel}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(vals) =>
          Array.isArray(vals) && vals.length === allValues.length
            ? "All"
            : vals.join(", ")
        }
        MenuProps={MenuProps}
        sx={{
          "& .MuiSelect-select": {
            padding: "5px 8px",
          },
          borderRadius: 10,
        }}
      >
        {/* Select All option */}
        <MenuItem value="__ALL__">
          <Checkbox
            checked={sel.length === allValues.length}
            indeterminate={sel.length > 0 && sel.length < allValues.length}
            sx={{ transform: "scale(0.7)" }}
          />
          <ListItemText
            primary={<Typography sx={{ fontSize: 12 }}>Select All</Typography>}
          />
        </MenuItem>

        {/* Normal options */}
        {options.map((opt) => {
          const value = typeof opt === "string" ? opt : opt.value;
          const labelText = labelFor(opt);
          return (
            <MenuItem key={value} value={value}>
              <Checkbox
                checked={sel.includes(value)}
                sx={{ transform: "scale(0.7)" }}
              />
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: 12 }}>{labelText}</Typography>
                }
              />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
