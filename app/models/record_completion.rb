class RecordCompletion < ApplicationRecord
  belongs_to :record

  def self.insert_all(records)
    normalized = normalize(records)
    super(normalized)
  end

  def self.normalize(records)
    records.map { add_timestamp(it) }
  end

  def self.add_timestamp(record)
    time = Time.current

    record["created_at"] = time
    record["updated_at"] = time
  end
end
