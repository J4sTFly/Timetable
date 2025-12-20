module Records
  class CreateService
    def call(name, date)
      # Save new Record and create completions for a month
      record = Record.new(name:, date:)
      ActiveRecord::Base.transaction do
        raise ActiveRecord::Rollback unless record.save

        create_completions(record.id, record.date)
      end

      record
    end

    private

    def create_completions(id, start_date)
      days = 1..Time.days_in_month(start_date.month)
      record_completions = days.map { { date: Date.new(start_date.year, start_date.month, it),
                                        completed: false,
                                        record_id: id
      } }
      RecordCompletion.insert_all record_completions
    end
  end
end
