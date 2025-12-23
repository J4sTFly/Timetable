module Records
  class ProlongRecordsDateService
    def initialize(ids)
      @ids = ids
    end

    def call
      records = Record.includes(:record_completions).where(id: ids).map(&:attributes)
      :new_records
    end
  end
end
