class RecordsController < ApplicationController
  before_action :set_date_range, only: %i[index filter]
  before_action :set_record, only: %i[update destroy]
  before_action :set_records, only: %i[index filter]
  before_action :set_totals, only: %i[index filter]

  def index
  end

  def filter
    render partial: 'table'
  end

  def new
    record = Record.new

    render :new, locals: { record: }
  end

  def create
    new_record = Records::CreateService.new.call(record_params)

    if new_record.valid?
      set_date_range
      set_records
      render partial: "table"
    else
      render "shared/errors", locals: { obj: new_record }, status: :unprocessable_entity
    end
  end

  def update
    if @record.update(record_params)
      head :ok
    else
      render "shared/errors", locals: { obj: @record }, status: :unprocessable_entity
    end
  end

  def destroy
    @record.destroy

    redirect_to records_path, notice: "Deleted successfully."
  end

  def prolong_records_date
    prolonged_successfully = Records::ProlongService.new.call(prolong_params[:ids], prolong_params[:date])

    prolonged_successfully ? (head :ok) : (head :unprocessable_entity)
  end

  def mass_destroy
    Record.where(id: params[:ids]).in_batches(of: 20) do |batch|
      batch.destroy_all
    end

    head :ok
  end

  private

  def set_records
    @records = Record.includes(:record_completions).where(date: @start_date..@end_date).order(order: :asc)
  end

  def set_totals
    @total_completed = @records.map(&:record_completions).flatten.filter(&:completed?).size
  end

  def set_date_range
    if cookies[:year].present? && cookies[:month].present?
      year, month = cookies[:year].to_i, cookies[:month].to_i
      @start_date = Date.new(year, month, 1)
      @end_date = Date.new(year, month, Time.days_in_month(month, year))
    else
      today = Date.current
      @start_date = today.beginning_of_month
      @end_date = today.end_of_month
    end
  end

  def set_record
    @record = Record.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    redirect_to records_path, alert: "Record not found."
  end

  def record_params
    params.require(:record).permit :name, :date, :order
  end

  def prolong_params
    params.fetch(:records, {}).permit(:date, ids: [])
  end
end
