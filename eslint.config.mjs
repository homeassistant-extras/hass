import { createLibraryEslintConfig } from '@homeassistant-extras/config/eslint/library';

export default createLibraryEslintConfig({
  tsconfigRootDir: import.meta.dirname,
});
