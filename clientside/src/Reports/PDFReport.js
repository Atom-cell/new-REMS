// import React from "react";
// import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// const styles = StyleSheet.create({
//   body: {
//     paddingTop: 35,
//     paddingBottom: 65,
//     paddingHorizontal: 35,
//   },
//   title: {
//     fontSize: 24,
//     textAlign: "center",
//     // fontFamily: "Oswald",
//   },
//   author: {
//     fontSize: 12,
//     textAlign: "center",
//     marginBottom: 40,
//   },
//   subtitle: {
//     fontSize: 18,
//     margin: 12,
//     // fontFamily: "Oswald",
//   },
//   days: {
//     fontSize: 18,
//     marginHorizontal: 12,
//     // fontFamily: "Oswald",
//   },
//   text: {
//     margin: 12,
//     fontSize: 14,
//     textAlign: "justify",
//     // fontFamily: "Times-Roman",
//   },
//   header: {
//     fontSize: 12,
//     marginBottom: 20,
//     textAlign: "center",
//     color: "grey",
//   },
//   table: {
//     width: "100%",
//     // fontFamily: "Oswald",
//     margin: 12,
//   },
//   row: {
//     display: "flex",
//     flexDirection: "row",
//     borderTop: "1px solid #EEE",
//     paddingTop: 8,
//     paddingBottom: 8,
//   },
//   header: {
//     borderTop: "none",
//   },
//   bold: {
//     fontWeight: "bold",
//   },
//   row1: {
//     width: "40%",
//   },
//   row2: {
//     width: "30%",
//   },
//   row3: {
//     width: "30%",
//   },
// });
// const PDFReport = ({ inOut, username, worked, absents }) => {
//   return (
//     <Document>
//       <Page style={styles.body}>
//         <Text style={styles.title}>REMS</Text>
//         <Text style={styles.title}>
//           {username.toUpperCase()} MONTHLY IN-OUT REPORT
//         </Text>
//         <Text style={styles.author}>of November</Text>
//         <Text style={styles.days}>Days Worked: {worked}</Text>
//         <Text style={styles.days}>Non Worked Days: {absents}</Text>

//         <View style={styles.table}>
//           <View style={[styles.row, styles.bold]}>
//             <Text style={styles.row1}>Date</Text>
//             <Text style={styles.row2}>In Time</Text>
//             <Text style={styles.row3}>Out Time</Text>\
//           </View>
//           {inOut.map((row, i) => (
//             <View key={i} style={styles.row} wrap={false}>
//               <Text style={styles.row1}>{row.date}</Text>
//               <Text style={styles.row2}>{row.In}</Text>
//               <Text style={styles.row3}>{row.Out}</Text>
//             </View>
//           ))}
//         </View>
//       </Page>
//     </Document>
//   );
// };

// export default PDFReport;
