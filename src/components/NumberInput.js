// Lib Imports
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

// App Imports
import classes from './NumberInput.module.css';

// support for react refs
const NumberInput = forwardRef(
  (
    {
      className,
      allowNegativeValue = false,
      allowDecimals = false,
      allowLeadingZeroes = false, // if true, will be used with type='text', otherwise leading zeroes will be shown to user but lost with JS number type handling
      hideButtons = false,
      decimalsLimit = 2,
      onKeyPress,
      onPaste,
      onChange,
      min,
      type,
      customInput: CustomInput,
      ...rest
    },
    ref,
  ) => {
    // restrict user from entering negative and/or floating point values
    // apart from '.' and '-', HTML input type='number' allows typing 'e' signifying exponential, but is confusing to user
    const handleKeyPress = e => {
      if (
        (e.key === '-' && !allowNegativeValue) ||
        e.key === 'e' ||
        e.key === 'E' ||
        (e.key === '.' && !allowDecimals) ||
        (allowLeadingZeroes && !e.key.match(/^[0-9]$/g)) // because type will be 'text', thus will need to block non-numbers
      ) {
        e.preventDefault();
        return false;
      }
      if (onKeyPress && typeof onKeyPress === 'function') onKeyPress(e);
    };

    // restrict user from pasting negative and/or floating point values
    const handlePaste = e => {
      var pasteData = e.clipboardData.getData('text/plain');
      if ((pasteData.match(/[-]/) && !allowNegativeValue) || (pasteData.match(/[.]/) && !allowDecimals)) {
        e.preventDefault();
        return false;
      }
      if (onPaste && typeof onPaste === 'function') onPaste(e);
    };

    // remove leading zeroes, if any
    const removeLeadingZeroes = val => {
      // for positive numbers
      if (val.charAt(0) === '0') {
        if (val.charAt(1) && val.charAt(1) !== '.') {
          return val.slice(1);
        }
      } else if (val.charAt(0) === '-' && val.charAt(1) === '0') {
        // for negative numbers
        if (val.charAt(2) && val.charAt(2) !== '.') {
          return '-' + val.slice(2);
        }
      }
      //
      return val;
    };

    const removeAccessDecimals = val => {
      if (val.includes('.')) {
        const [int, decimals] = val.split('.');
        const trimmedDecimals = (decimalsLimit || 2) && decimals ? decimals.slice(0, decimalsLimit || 2) : decimals;
        const includeDecimals = allowDecimals ? `.${trimmedDecimals}` : '';

        return `${int}${includeDecimals}`;
      }
      return val;
    };

    const handleChange = e => {
      let val = e.target.value;
      let newVal = val;
      if (!allowLeadingZeroes) newVal = removeLeadingZeroes(val);
      if (allowDecimals) newVal = removeAccessDecimals(newVal);
      e.target.value = newVal;
      if (onChange && typeof onChange === 'function') onChange(e);
    };

    let props = {
      className: `${className} ${hideButtons ? classes.hideButtons : ''}`,
      type: allowLeadingZeroes ? 'text' : 'number',
      ref,
      onKeyPress: handleKeyPress,
      onPaste: handlePaste,
      onChange: handleChange,
      min: !allowDecimals ? Math.max(0, min || 0) : min, // for increment/decrement controls
      ...rest,
    };

    if (CustomInput) <CustomInput {...props} />;

    return <input {...props} />;
  },
);

NumberInput.propTypes = {
  allowNegativeValue: PropTypes.bool,
  allowDecimals: PropTypes.bool,
  allowLeadingZeroes: PropTypes.bool,
  hideButtons: PropTypes.bool,
  onKeyPress: PropTypes.func,
  onPaste: PropTypes.func,
  onChange: PropTypes.func,
  min: PropTypes.number,
  type: PropTypes.string,
  decimalsLimit: PropTypes.number,
  customInput: PropTypes.elementType,
  className: PropTypes.string,
};

// setting display name for eslint warning (react/display-name)
NumberInput.displayName = 'NumberInput';

export default NumberInput;
