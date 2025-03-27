window.RowDraw = (row) => {
  const template = `
      <tr>
        <td align="center"><button class="btn btn-link p-0" data-id="${row['calc_id']}" onclick="orderExport(${row['calc_id']});"><i class="fa fa-cloud-download-alt fa-2x"></i></button></td>
        <td>${row['calc_date']}</td>
        <td>${row['status']}</td>
        <td>${row['upper_bound_coeff']}</td>
        <td>${row['lower_bound_coeff']}</td>
        <td>${row['trust_remains']}</td>
        <td>${row['z_coeff_fluctuations']}</td>
        <td>${row['z_coeff_under_forecast']}</td>
        <td>${row['max_safety_stock_days']}</td>
        <td>${row['max_safety_stock_percent']}</td>
        <td>${row['delivery_frequency']}</td>
        <td>${row['minimum_order_quantity_percent']}</td>
        <td>${row['minimum_order_percent']}</td>
        <td>${row['log'] || ''}</td>
      </tr>
    `;
  return template
}