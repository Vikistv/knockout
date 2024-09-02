function Category(name, documents) {
  this.name = ko.observable(name);
  this.documents = this.documents = ko.observableArray(documents);
  this.isOpen = ko.observable(false);

  this.toggle = function () {
    this.isOpen(!this.isOpen());
  };
}

function DocumentsViewModel() {
  let self = this;
  this.categories = ko.observableArray([
    new Category("Обязательные для всех", ["Паспорт", "ИНН"]),
    new Category("Обязательные для трудоустройства", [
      "Трудовая книжка",
      "СНИЛС",
    ]),
    new Category("Специальные", ["Сертификат COVID-19", "Военный билет"]),
  ]);

  this.dragItem = ko.observable(null);

  this.selectedItem = function (category) {
    if (self.dragItem() === category) {
      self.dragItem(null);
    } else {
      self.dragItem(category);
    }
  };

  this.moveItem = function (targetItem) {
    if (self.dragItem() && self.dragItem() !== targetItem) {
      const moveFrom = self.categories.indexOf(self.dragItem());
      const moveTo = self.categories.indexOf(targetItem);
      const movingElement = document.querySelector(".group-title.selected");
      if (movingElement) {
        movingElement.classList.add("moving");
      }
      setTimeout(() => {
        self.categories.splice(moveFrom, 1);
        self.categories.splice(moveTo, 0, self.dragItem());

        if (movingElement) {
          movingElement.classList.remove("moving");
        }

        self.dragItem(null);
      }, 700);
    }
  };

  this.startMoveDocument = function (document, category) {
    self.dragItem({ document, category });
  };

  this.moveDocument = function (targetDocument, targetCategory) {
    const dragDocument = self.dragItem();

    if (dragDocument && dragDocument.document !== targetDocument) {
      const fromCategory = dragDocument.category;
      const toCategory = targetCategory;

      fromCategory.documents.remove(dragDocument.document);

      if (fromCategory !== toCategory) {
        toCategory.documents.push(dragDocument.document);
      } else {
        const toIndex = toCategory.documents.indexOf(targetDocument);
        toCategory.documents.splice(toIndex, 0, dragDocument.document);
      }

      self.dragItem(null);
    }
  };
}

ko.applyBindings(
  new DocumentsViewModel(),
  document.getElementById("knockout-test")
);
