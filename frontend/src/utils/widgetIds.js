export const widgetConfig = [
  { id: "top5", domId: "widget-top5", title: "Top 5 Riskiest Tasks" },
  { id: "riskChart", domId: "widget-chart", title: "Risk by Task (Bar Chart)" },
  { id: "rationales", domId: "widget-rationales", title: "All Task Risk Rationales" },
];

export const widgetDomIdById = (id) => {
  const w = widgetConfig.find((x) => x.id === id);
  return w ? w.domId : null;
};

export const widgetTitleById = (id) => {
  const w = widgetConfig.find((x) => x.id === id);
  return w ? w.title : id;
};
