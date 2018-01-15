require 'test_helper'

class Api::SearchControllerTest < ActionDispatch::IntegrationTest
  test "should get search" do
    get api_search_search_url
    assert_response :success
  end

end
