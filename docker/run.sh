echo "export TOKEN_REDIRECT=$TOKEN_REDIRECT" > /app/process.env
echo "export LOGOUT_TOKEN_REDIRECT=$LOGOUT_TOKEN_REDIRECT" >> /app/process.env
echo "export API_URL=$API_URL" >> /app/process.env
echo "export COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID" >> /app/process.env
echo "export COGNITO_BASE_URL=$COGNITO_BASE_URL" >> /app/process.env

npm run build