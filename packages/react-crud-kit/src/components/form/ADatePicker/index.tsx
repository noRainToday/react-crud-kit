import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { ADatePickerProps } from "@/types/base";

const ADatePicker: React.FC<ADatePickerProps> = ({
  value,
  valueFormat,
  onChange,
  ...restProps
}) => {
  const [innerValue, setInnerValue] = useState<Dayjs | null>(null);
  useEffect(() => {
    if (value) {
      const parsed = valueFormat
        ? dayjs(value, valueFormat, true) // 严格模式
        : dayjs(value); // 没传格式就让 dayjs 自行解析
      setInnerValue(parsed.isValid() ? parsed : null);
    } else {
      setInnerValue(null);
    }
  }, [value, valueFormat]);

  const handleChange = (val: Dayjs | null) => {
    setInnerValue(val);
    if (onChange) {
      const result = val
        ? valueFormat
          ? val.format(valueFormat)
          : val.toISOString() // 不传 valueFormat 则返回 ISO 格式字符串
        : undefined;
      onChange(result);
    }
  };

  return (
    <DatePicker
      showTime
      value={innerValue}
      onChange={handleChange}
      {...restProps}
    />
  );
};

export default ADatePicker;
