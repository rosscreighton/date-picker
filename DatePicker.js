function DatePicker(containerId, callback) {
  this.containerId = containerId;
  this.callback = callback;
  this.divContainer = document.getElementById(this.containerId);

  this.dayCountForMonth = () => {
    return new Date(
      this.activeDate.getFullYear(),
      this.activeDate.getMonth() + 1,
      0
    ).getDate();
  }

  this.firstDayForMonth = () => {
    return new Date(
      this.activeDate.getFullYear(),
      this.activeDate.getMonth(),
      1
    ).getDay();
  }

  this.incrementMonth = () => {
    const newDate = new Date(
      this.activeDate.getFullYear(),
      this.activeDate.getMonth() + 1,
      this.activeDate.getDate()
    );

    this.activeDate = newDate;
    this.render();
  }

  this.decrementMonth = () => {
    const newDate = new Date(
      this.activeDate.getFullYear(),
      this.activeDate.getMonth() - 1,
      this.activeDate.getDate()
    );

    this.activeDate = newDate;
    this.render();
  }

  this.setActiveDate = (targetDay) => {
    const newDate = new Date(
      this.activeDate.getFullYear(),
      this.activeDate.getMonth(),
      targetDay
    );

    this.activeDate = newDate;

    this.render();
  }

  this.getActiveDay = () =>  {
    return this.activeDate.getDate();
  }

  this.onSelectDate = (e) => {
    const targetDay = e.target.closest("td").dataset.cellDay;
    this.setActiveDate(targetDay);

    this.callback(this.containerId, {
      day: this.activeDate.getDate(),
      month: this.activeDate.getMonth(),
      year: this.activeDate.getFullYear()
    });
  }

  this.renderButtons = () => {
    const makeButton = () => document.createElement("button");
    const leftButton = makeButton();
    const rightButton = makeButton();
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    leftButton.innerText = "<";
    leftButton.onclick = this.decrementMonth.bind(this);
    rightButton.innerText = ">";
    rightButton.onclick = this.incrementMonth.bind(this);

    [leftButton, rightButton].forEach((b) => {
      buttonContainer.appendChild(b);
    })

    this.divContainer.appendChild(buttonContainer);
  }

  this.renderStatusText = () => {
    const statusDiv = document.createElement("div");
    statusDiv.innerText = this.activeDate.toISOString().slice(0, 10);
    this.divContainer.appendChild(statusDiv);
  }

  this.renderCalendarTable = () => {
    const firstDayForMonth = this.firstDayForMonth();
    const table = document.createElement("table");

    for (let cellIndex = 0; cellIndex < 42; cellIndex++) {
      if (cellIndex % 7 === 0) {
        const tr = document.createElement("tr");
        table.appendChild(tr);

        for(let rowCellIndex = cellIndex; rowCellIndex <= cellIndex + 6; rowCellIndex++) {
          const td = document.createElement("td");
          td.className = "day";
          td.onclick = this.onSelectDate.bind(this);

          if (rowCellIndex >= firstDayForMonth) {
            const monthEnd = this.dayCountForMonth() + firstDayForMonth;

            if (rowCellIndex < monthEnd) {
              const span = document.createElement("span");
              const cellDay = rowCellIndex + 1 - firstDayForMonth;
              span.innerText = cellDay;
              td.dataset.cellDay = cellDay;

              if (this.getActiveDay() === cellDay){
                td.className = td.className + " active";
              }

              td.appendChild(span);
            }
          }

          tr.appendChild(td);
        }
      }
    }

    this.divContainer.appendChild(table);
  }

  this.render = (date=this.activeDate) => {
    this.activeDate = date; // memoize active date
    this.divContainer.innerHTML = "";
    this.renderButtons();
    this.renderStatusText();
    this.renderCalendarTable();
  }
}

var cal = new DatePicker("calendar-container", (id, date) => {});
cal.render(new Date());

