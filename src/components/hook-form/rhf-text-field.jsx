// import { Controller, useFormContext } from 'react-hook-form';
// import { transformValue, transformValueOnBlur, transformValueOnChange } from 'minimal-shared/utils';

// import TextField from '@mui/material/TextField';

// // ----------------------------------------------------------------------

// export function RHFTextField({ name, helperText, slotProps, type = 'text', ...other }) {
//   const { control } = useFormContext();

//   const isNumberType = type === 'number';

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field, fieldState: { error } }) => (
//         <TextField
//           {...field}
//           fullWidth
//           value={isNumberType ? transformValue(field.value) : (field.value ?? '')}
//           onChange={(event) => {
//             const transformedValue = isNumberType
//               ? transformValueOnChange(event.target.value)
//               : event.target.value;

//             field.onChange(transformedValue);
//           }}
//           onBlur={(event) => {
//             const transformedValue = isNumberType
//               ? transformValueOnBlur(event.target.value)
//               : event.target.value;

//             field.onChange(transformedValue);
//           }}
//           type={isNumberType ? 'text' : type}
//           error={!!error}
//           helperText={error?.message ?? helperText}
//           slotProps={{
//             ...slotProps,
//             htmlInput: {
//               autoComplete: 'off',
//               ...slotProps?.htmlInput,
//               ...(isNumberType && { inputMode: 'decimal', pattern: '[0-9]*\\.?[0-9]*' }),
//             },
//           }}
//           {...other}
//         />
//       )}
//     />
//   );
// }
import { Controller, useFormContext } from 'react-hook-form';
import {
  transformValue,
  transformValueOnBlur,
  transformValueOnChange,
} from 'minimal-shared/utils';

// ----------------------------------------------------------------------

export function RHFTextField({
  name,
  helperText,
  type = 'text',
  className = '',
  inputClassName = '',
  label,
  fullWidth,
  slotProps,
  InputProps,
  InputLabelProps,
  // MUI-only props kept for API compatibility; they must not reach the DOM element
  multiline,
  rows,
  minRows,
  maxRows,
  size,
  ...other
}) {
  const { control } = useFormContext();

  const isNumberType = type === 'number';

  // `multiline` renders a textarea, like MUI's TextField did
  const InputElement = multiline ? 'textarea' : 'input';
  const elementProps = multiline
    ? { rows: rows ?? minRows ?? 3 }
    : {
        type: isNumberType ? 'text' : type,
        inputMode: isNumberType ? 'decimal' : undefined,
        pattern: isNumberType ? '[0-9]*\\.?[0-9]*' : undefined,
      };

  const startAdornment = slotProps?.input?.startAdornment;
  const endAdornment = slotProps?.input?.endAdornment;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={`w-full ${className}`}>
          {label && (
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {label}
            </label>
          )}

          <div
            className={[
              'flex items-center w-full rounded-md border bg-white transition',
              'border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200',
              error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-200' : '',
            ].join(' ')}
          >
            {startAdornment && (
              <div className="flex items-center shrink-0 pl-3">{startAdornment}</div>
            )}

            <InputElement
              {...field}
              {...elementProps}
              value={
                isNumberType ? transformValue(field.value) : (field.value ?? '')
              }
              onChange={(event) => {
                const transformedValue = isNumberType
                  ? transformValueOnChange(event.target.value)
                  : event.target.value;

                field.onChange(transformedValue);
              }}
              onBlur={(event) => {
                const transformedValue = isNumberType
                  ? transformValueOnBlur(event.target.value)
                  : event.target.value;

                field.onChange(transformedValue);
              }}
              autoComplete="off"
              className={[
                'w-full min-w-0 bg-transparent px-3 py-2 text-sm outline-none border-none',
                multiline ? 'resize-y' : '',
                'text-gray-900',
                startAdornment ? 'pl-1' : '',
                endAdornment ? 'pr-1' : '',
                inputClassName,
              ].join(' ')}
              {...other}
            />

            {endAdornment && (
              <div className="flex items-center shrink-0 pr-2">{endAdornment}</div>
            )}
          </div>

          {(error?.message || helperText) && (
            <p
              className={`mt-1 text-xs ${error?.message ? 'text-red-500' : 'text-gray-500'
                }`}
            >
              {error?.message || helperText}
            </p>
          )}
        </div>
      )}
    />
  );
}