class RecordsController < ApplicationController
  before_action :set_record, only: %i[update destroy]
  before_action :set_date_range, only: %i[index]

  def index
    @records = Record.includes(:record_completions).where(date: @start_date..@end_date)
    @total_completed = @records.map(&:record_completions).flatten.filter(&:completed?).size
  end

  def create
    record = Record.new record_params

    if record.save
      redirect_to records_path, notice: "Record created successfully."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if record.update(record_params)
      redirect_to records_path, notice: "Updated successfully."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @record.destroy

    redirect_to records_path, notice: "Deleted successfully."
  end

  def prolong_records_date
    result = Records::ProlongRecordsDateService.new(ids: params[:ids]).call

    render :prolong_records_date, locals: { result: }, status: result.success?  ? :ok : :unprocessable_entity
  end

  def mass_destroy
    Record.where(id: params[:ids]).in_batches(of: 20) do |batch|
      batch.destroy_all
    end
    
    head :ok
  end

  private

  def set_date_range
    today = Date.current
    @start_date = params[:start_date].present? ? Date.parse(params[:start_date]) : today.beginning_of_month
    @end_date = params[:end_date].present? ? Date.parse(params[:end_date]) : today.end_of_month
  end

  def set_record
    @record = Record.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    redirect_to records_path, alert: "Record not found."
  end

 def record_params
    params.require(:record).permit :name, :date
  end
end
