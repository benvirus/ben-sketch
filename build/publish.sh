echo '> npm run build...'
npm run build

echo '> npm version patch...'
version=$(npm version $1)

echo '> npm publish...'
npm publish

echo '> push gitlab...'
git push origin
git push origin $version

echo '> push github...'
git push github
git push github $version