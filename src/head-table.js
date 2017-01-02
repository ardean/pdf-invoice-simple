class HeadTable {
  getBody(leftFields, rightFields) {
    const headTableBody = [];
    const tableHeight = Math.max(leftFields.length, rightFields.length);

    for (let i = 0; i < tableHeight; i += 2) {
      const left = this.getField(leftFields[i]);
      const left2 = this.getField(leftFields[i + 1]);

      const right = this.getField(rightFields[i]);
      const right2 = this.getField(rightFields[i + 1]);

      const line = [].concat(left, left2, "", right, right2);
      headTableBody.push(line);
    }

    return headTableBody;
  }

  getField(field) {
    if (!field) return "";
    return field;
  }
}

export default new HeadTable();
