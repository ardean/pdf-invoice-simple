class HeadTable {
  getWidths(leftFields, rightFields) {
    const left = this.getWidth(leftFields[0]);
    const right = this.getWidth(rightFields[0]);
    return left.concat("*", right);
  }

  getWidth(field) {
    if (typeof field === "object" && typeof field.key === "string") {
      return ["auto", "auto"];
    } else {
      return ["auto"];
    }
  }

  getBody(leftFields, rightFields) {
    const headTableBody = [];
    const tableHeight = Math.max(leftFields.length, rightFields.length);

    for (let i = 0; i < tableHeight; i++) {
      const left = this.getField(leftFields[i]);
      const right = this.getField(rightFields[i]);
      const line = left.concat("", right);
      headTableBody.push(line);
    }

    return headTableBody;
  }

  getField(field) {
    if (typeof field === "object" && typeof field.key === "string") {
      field = field || {};

      return [
        field.key || "", {
          text: field.value || "",
          alignment: "right"
        }
      ];
    } else {
      field = field || "";

      const mapped = {
        text: typeof field === "string" ? field : field.value || ""
      };

      if (field.fontSize) {
        mapped.fontSize = field.fontSize;
      }

      if (field.color) {
        mapped.color = field.color;
      }

      if (field.margin) {
        mapped.margin = field.margin;
      }

      return [mapped];
    }
  }
}

export default new HeadTable();
