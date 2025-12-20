module RecordsHelper
  def days_in_month
    1..Time.days_in_month(Time.current.month)
  end
end
