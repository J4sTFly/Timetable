module Records
  class CreateService
    def call(params)
      Record.transaction do
        record = create_record(params)
        create_monthly_completions(record)
        record
      end
    rescue ActiveRecord::RecordInvalid => e
      e.record
    end

    private

    def create_record(params)
      order = calculate_order(params[:date])
      Record.create!(params.merge(order: order))
    end

    def create_monthly_completions(record)
      completions = generate_completions_for_month(record)
      RecordCompletion.insert_all(completions)
    end

    def generate_completions_for_month(record)
      start_date = record.date
      days_in_month = Time.days_in_month(start_date.month, start_date.year)

      (1..days_in_month).map do |day|
        {
          date: Date.new(start_date.year, start_date.month, day),
          completed: false,
          record_id: record.id,
          created_at: Time.current,
          updated_at: Time.current
        }
      end
    end

    def calculate_order(date)
      date = date.to_date
      next_month = date + 1.month
      Record.where(date: date..next_month).maximum(:order).to_i + 1
    end
  end
end
