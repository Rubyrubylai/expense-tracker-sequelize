module.exports = {
  monthYear: function(d) {
    let month = d.getMonth() + 1
    let Year = d.getFullYear()
    return monthYear = Year + '-' + month
  }
}