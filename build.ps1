# Build the Eleventy site from source
# Removes the existing _site output directory, then runs a fresh build.

Remove-Item _site -Recurse -Force -ErrorAction SilentlyContinue
npx @11ty/eleventy 2>&1
