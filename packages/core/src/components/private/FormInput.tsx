import React from 'react';
import { Omit } from 'utility-types';
import withStyles, { WithStylesProps } from '../../composers/withStyles';
import buildInputStyles from '../../themes/buildInputStyles';

export type IgnoreAttributes =
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'onChange'
  | 'value'
  // RDFa attributes
  | 'about'
  | 'datatype'
  | 'inlist'
  | 'prefix'
  | 'property'
  | 'resource'
  | 'typeof'
  | 'vocab'
  // Non-standard attributes
  | 'inputMode'
  | 'is'
  | 'radioGroup'
  | 'color'
  | 'results'
  | 'security';

export type Props<T = any> = {
  /** Decrease font size and padding. */
  compact?: boolean;
  /** Mark the field as important. */
  important?: boolean;
  /** Mark the field as invalid. */
  invalid?: boolean;
  /** Add "notranslate" className to prevent Google Chrome translation. */
  noTranslate?: boolean;
  /** Mark the field as optional. */
  optional?: boolean;
  /** Reference to access the underlying input DOM element. */
  propagateRef?: React.Ref<T>;
  /** Current value. */
  value?: string;
};

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, IgnoreAttributes> &
  Props<HTMLInputElement>;

export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, IgnoreAttributes> &
  Props<HTMLSelectElement>;

export type TextAreaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  IgnoreAttributes
> &
  Props<HTMLTextAreaElement>;

export type PrivateProps = Props &
  WithStylesProps & {
    // Support everything for convenience
    [key: string]: any;
    /** @ignore */
    children?: React.ReactNode;
    /** @ignore */
    hasPrefix?: boolean;
    /** @ignore */
    hasSuffix?: boolean;
    /** @ignore */
    tagName: 'input' | 'select' | 'textarea';
  };

class FormInput extends React.Component<PrivateProps> {
  static defaultProps = {
    children: null,
    compact: false,
    disabled: false,
    hasPrefix: false,
    hasSuffix: false,
    hidden: false,
    important: false,
    invalid: false,
    noTranslate: false,
    optional: false,
    value: '',
  };

  render() {
    const {
      cx,
      children,
      compact,
      disabled,
      hasPrefix,
      hasSuffix,
      hidden,
      id,
      important,
      invalid,
      noTranslate,
      optional,
      propagateRef,
      styles,
      tagName: Tag,
      ...restProps
    } = this.props;
    const isSelect = Tag === 'select';
    const props: any = {
      ...restProps,
      className: cx(
        styles.input,
        important && styles.input_important,
        compact && styles.input_compact,
        invalid && styles.input_invalid,
        disabled && styles.input_disabled,
        hidden && styles.input_hidden,
        isSelect && styles.select,
        isSelect && compact && styles.select_compact,
        hasPrefix && styles.input_hasPrefix,
        hasSuffix && styles.input_hasSuffix,
      ),
      disabled,
      id,
      required: !optional,
    };

    // Only populate when invalid, otherwise it will break some CSS selectors
    if (invalid) {
      props['aria-invalid'] = true;
      props['aria-describedby'] = `${id}-error`;
    }

    // Cannot use chidren for input/textarea as they are void elements
    if (isSelect) {
      props.children = children;
    }

    // Add magical className to prevent Google Chrome translation
    if (noTranslate) {
      props.className += ' notranslate';
    }

    // @ts-ignore [ts] JSX element type 'Component' does not have any construct or call signatures. [2604]
    return <Tag {...props} ref={propagateRef} data-gramm="false" data-enable-grammarly="false" />;
  }
}

export default withStyles(buildInputStyles)(FormInput);
