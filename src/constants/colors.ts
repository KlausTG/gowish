import { blood_orange, brand, lime_green, neutral, pale_yellow } from "./base";

export const colors = {
  background: {
    default: brand[50],
    tonal: brand[100],
    tonal_medium: brand[200],
    tonal_strong: brand[300],
    surface: {
      1: brand[400],
      2: brand[500],
      3: brand[600],
    },
  },
  text: {
    primary: brand[900],
    secondary: neutral[600],
    accent: lime_green[500],
    danger: blood_orange[500],
    disabled: neutral[400],
    placeholder: neutral[300],
    hint: neutral[200],
    muted: neutral[100],
    inverted: brand[50],
  },
  components: {
    button: {
      primary: {
        default: brand[500],
        hovered: brand[600],
        disabled: neutral[400],
        pressed: brand[700],
      },
    },
  },
  border: {
    default: neutral[200],
    medium: neutral[300],
    strong: neutral[400],
  },
  icon: {
    primary: brand[900],
    success: lime_green[500],
    danger: blood_orange[600],
    warning: pale_yellow[500],
    muted: neutral[100],
    hint: neutral[200],
    disabled: neutral[400],
  },
} as const;
