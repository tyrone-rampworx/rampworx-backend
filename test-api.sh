#!/bin/bash

# API test script for RampWorx backend
API_URL="http://localhost:5000/api"
TOKEN=""

echo "🚀 Testing RampWorx API endpoints..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test registration
echo -e "\n${GREEN}Testing registration...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${API_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser2","email":"test2@example.com","password":"password123","membership_id":"M124"}')
echo $REGISTER_RESPONSE

# Test login
echo -e "\n${GREEN}Testing login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@example.com","password":"password123"}')
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo $LOGIN_RESPONSE

if [ -z "$TOKEN" ]; then
  echo -e "${RED}No token received. Subsequent tests will fail.${NC}"
  exit 1
fi

# Test protected routes
echo -e "\n${GREEN}Testing protected routes...${NC}"

# Get profile
echo -e "\n${GREEN}Testing get profile...${NC}"
curl -s -X GET "${API_URL}/auth/profile" \
  -H "Authorization: Bearer $TOKEN"

# Get all users
echo -e "\n${GREEN}Testing get all users...${NC}"
curl -s -X GET "${API_URL}/users" \
  -H "Authorization: Bearer $TOKEN"

# Get specific user
echo -e "\n${GREEN}Testing get user by ID...${NC}"
curl -s -X GET "${API_URL}/users/1" \
  -H "Authorization: Bearer $TOKEN"

# Update user
echo -e "\n${GREEN}Testing update user...${NC}"
curl -s -X PUT "${API_URL}/users/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"updateduser","membership_id":"M125"}'

# Delete user (commented out for safety)
# echo -e "\n${GREEN}Testing delete user...${NC}"
# curl -s -X DELETE "${API_URL}/users/1" \
#   -H "Authorization: Bearer $TOKEN"

echo -e "\n${GREEN}API tests completed!${NC}"