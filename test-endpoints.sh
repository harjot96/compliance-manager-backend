#!/bin/bash

# Test OpenAI API Key Endpoints
echo "🧪 Testing OpenAI API Key Endpoints"
echo "=================================="

BASE_URL="http://localhost:3333"
API_KEY="sk-your-openai-api-key-here"
AUTH_TOKEN="your-jwt-token-here"

echo ""
echo "📋 Available Endpoints:"
echo "✅ POST /api/openai-admin/test-api-key - Test API key"
echo "✅ POST /api/openai-admin/settings - Save OpenAI settings"
echo "✅ GET /api/openai-admin/settings - Get OpenAI settings"
echo "✅ GET /api/openai-admin/settings/all - Get all settings"
echo "✅ PUT /api/openai-admin/settings/:id - Update settings"
echo "✅ DELETE /api/openai-admin/settings/:id - Delete settings"
echo "✅ DELETE /api/openai-admin/settings - Clear all settings (superadmin)"
echo "✅ GET /api/openai-admin/api-key - Get API key (temporary)"

echo ""
echo "🔧 Test Commands:"
echo ""

echo "1. Test API key (without auth - will fail):"
echo "curl -X POST $BASE_URL/api/openai-admin/test-api-key \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"apiKey\": \"$API_KEY\"}'"
echo ""

echo "2. Test API key (with auth):"
echo "curl -X POST $BASE_URL/api/openai-admin/test-api-key \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -H \"Authorization: Bearer $AUTH_TOKEN\" \\"
echo "  -d '{\"apiKey\": \"$API_KEY\"}'"
echo ""

echo "3. Get OpenAI settings:"
echo "curl -X GET $BASE_URL/api/openai-admin/settings \\"
echo "  -H \"Authorization: Bearer $AUTH_TOKEN\""
echo ""

echo "4. Save OpenAI settings:"
echo "curl -X POST $BASE_URL/api/openai-admin/settings \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -H \"Authorization: Bearer $AUTH_TOKEN\" \\"
echo "  -d '{\"apiKey\": \"$API_KEY\"}'"
echo ""

echo "5. Clear all settings (superadmin only):"
echo "curl -X DELETE $BASE_URL/api/openai-admin/settings \\"
echo "  -H \"Authorization: Bearer $AUTH_TOKEN\""
echo ""

echo "💡 Instructions:"
echo "1. Replace 'sk-your-openai-api-key-here' with your actual OpenAI API key"
echo "2. Replace 'your-jwt-token-here' with a valid JWT token"
echo "3. Run the commands above to test the endpoints"
echo ""

echo "🚨 Note: The endpoint you tried (/api/openai-admin/test-key) doesn't exist."
echo "   Use /api/openai-admin/test-api-key instead (POST method)."
