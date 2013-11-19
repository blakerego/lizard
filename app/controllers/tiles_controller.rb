class TilesController < ApplicationController
  before_action :set_tile, only: [:show, :edit, :update, :destroy, :publish, :aws_success_action]
  before_filter :authenticate_user!, :except => [:full_tile]
  filter_resource_access :collection => [[:reorder, :index], [:sizing, :index], :index]

  # GET /tiles
  # GET /tiles.json
  def index
    @tiles = Tile.published
    @secret_tiles = Tile.secret
  end

  # GET /tiles/1
  # GET /tiles/1.json
  def show
    @uploader = @tile.image
    @uploader.success_action_redirect = aws_success_action_tile_url(@tile)
    # @uploader.success_action_redirect = tile_url(@tile)
  end

  def aws_success_action
    @tile.update_attributes(:key => params[:key])
    redirect_to @tile
  end

  # GET /tiles/new
  def new
  end

  # GET /tiles/1/edit
  def edit
  end

  # POST /tiles
  # POST /tiles.json
  def create
    vimeo_id = tile_params.delete :vimeo_id
    @tile = Tile.new(tile_params)

    if (vimeo_id.present?)
      @tile.media_url = 'http://player.vimeo.com/video/' + vimeo_id
    end

    respond_to do |format|
      if @tile.save
        format.html { redirect_to :index, notice: 'Tile was successfully created.' }
        format.json { render action: 'show', status: :created, location: @tile }
      else
        format.html { render action: 'new' }
        format.json { render json: @tile.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tiles/1
  # PATCH/PUT /tiles/1.json
  def update
    vimeo_id = tile_params.delete :vimeo_id
    
    if vimeo_id.present?
      @tile.update_attributes(:media_url => 'http://player.vimeo.com/video/' + vimeo_id)
    end

    respond_to do |format|
      if @tile.update(tile_params)
        format.html { redirect_to @tile, notice: 'Tile was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @tile.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit_image
  end

  def publish
    @tile.published = true
    if (@tile.save)
      redirect_to @tile, notice: 'Tile was successfully updated.'
    end
  end

  # DELETE /tiles/1
  # DELETE /tiles/1.json
  def destroy
    @tile.destroy
    respond_to do |format|
      format.html { redirect_to tiles_url }
      format.json { head :no_content }
    end
  end

  def reorder
    updated = []
    params['tiles'].each do |tile_rank|
      assignment = Tile.find(tile_rank[0])
      assignment.update_attributes(:position => tile_rank[1])
      updated << assignment
    end
    render :json => {'updated' => updated}
  end

  def sizing
  end

  def full_tile
    render :partial => 'full_tile', :locals => {:tile => @tile}
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tile
      @tile = Tile.find(params[:id])
    end

    def new_tile_from_params
      if params[:tile].present?
        @tile = Tile.new(tile_params)
      else 
        @tile = Tile.new
      end
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def tile_params
      params.require(:tile).permit( :name, :media_type, :position, :published, \
                                    :vimeo_id, :size, :image, :lyrics, :group_id, \
                                    :background_color)
    end
end
