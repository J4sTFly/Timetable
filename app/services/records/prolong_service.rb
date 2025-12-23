module Records
  class ProlongService
    def call(ids, date)
      ApplicationRecord.transaction do
        new_record_ids = insert_records(ids, date).rows.flatten
        insert_completions(new_record_ids, date)
      end

      true
    rescue ActiveRecord::RecordInvalid => e
      false
    end

    private

    def insert_records(ids, date)
      records_fields = Record.where(id: ids).select %i[name order date]
      records_fields.each { it.date = date.to_date }
      Record.insert_all(records_fields.map(&:attributes), returning: [ :id ])
    end

    def insert_completions(ids, date)
      date = date.to_date
      record_completions = []
      ids.each do |id|
        1.upto(Time.days_in_month(date.month, date.year)) do |day|
          record_completions << { record_id: id,
                                  date: Date.new(date.year, date.month, day),
                                  created_at: Time.current,
                                  updated_at: Time.current }
        end
      end

      RecordCompletion.insert_all(record_completions)
    end
  end
end
