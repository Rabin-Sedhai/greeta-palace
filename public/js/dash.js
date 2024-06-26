 document.addEventListener("DOMContentLoaded", function() {
    function renderAreaChart(completedCount, pendingCount, cancelledCount) {
      const barChartOptionsBooking = {
        series: [
          {
            data: [completedCount, pendingCount, cancelledCount],
          },
        ],
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false,
          },
        },
        colors: ['#367952', 'rgb(56, 171, 56)', '#cc3c43'],
        plotOptions: {
          bar: {
            distributed: true,
            borderRadius: 4,
            horizontal: false,
            columnWidth: '40%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        xaxis: {
          categories: ['Completed', "Pending", 'Cancelled'],
        },
        yaxis: {
          title: {
            text: 'Count',
          },
        },
      };
  
      const barChartBooking = new ApexCharts(
        document.querySelector('#area-chart'),
        barChartOptionsBooking
      );
      barChartBooking.render();
    }
  
    async function bookingStats() {
      const completed = document.getElementById("complete");
      const pending = document.getElementById("pending");
      const cancelled = document.getElementById("cancelled");
      const sum = document.getElementById("sum");
  
      try {
        const response = await fetch('/api/statuscount');
        const stats = await response.json();
        completed.innerHTML = stats.completeCount;
        pending.innerHTML = stats.pendingCount;
        cancelled.innerHTML = stats.cancelledCount;
        sum.innerHTML = "Rs." + stats.sum;
  
        renderAreaChart(stats.completeCount, stats.pendingCount, stats.cancelledCount);
      } catch (error) {
        console.error('Error fetching booking stats:', error);
      }
    }
  
    bookingStats();
  });
  


let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');

function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add('sidebar-responsive');
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove('sidebar-responsive');
    sidebarOpen = false;
  }
}
