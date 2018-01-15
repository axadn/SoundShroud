class Api::SearchController < ApplicationController
  def index
    @results = PgSearch.multisearch(params[:query]).includes(:searchable)
    render :index
  end
end
