import {
  initDatabase,
  createTables,
  executeSql,
  executeSelect,
  executeTransaction as _executeTransaction,
  saveDatabase,
} from './SqliteManager';
import { CreateTable as _CreateTable } from './CreateTable';

// Initialize database and create tables
export const SqlDB = {
  init: initDatabase,
  createTables,
};

export { createTables };

// ============================================================================
// Data Insertion Helper Functions
// ============================================================================

/**
 * Insert Settings data
 */
async function insertSettingData(settings: any[]) {
  try {
    await executeSql('DELETE FROM Settings');
    for (const setting of settings) {
      await executeSql(
        'INSERT INTO Settings (Key, Value) VALUES (?, ?)',
        [String(setting.Key || ''), String(setting.Value || '')]
      );
    }
    // Also insert into Setting table for compatibility
    for (const setting of settings) {
      await executeSql(
        'INSERT OR REPLACE INTO Setting (Name, Value) VALUES (?, ?)',
        [String(setting.Key || ''), String(setting.Value || '')]
      );
    }
    console.log('PWA: Settings inserted:', settings.length);
  } catch (error) {
    console.error('PWA: insertSettingData error', error);
  }
}

/**
 * Insert MultiEntityUser data
 */
async function insertMultiEntityUser(data: any[]) {
  try {
    await executeSql('DELETE FROM MultiEntityUser');
    for (const item of data) {
      await executeSql(
        'INSERT INTO MultiEntityUser (UserId, DistributorId, DivisionId, Distributor) VALUES (?, ?, ?, ?)',
        [String(item.UserId || ''), String(item.DistributorId || ''), String(item.DivisionId || ''), String(item.Distributor || '')]
      );
    }
    console.log('PWA: MultiEntityUser inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertMultiEntityUser error', error);
  }
}

/**
 * Insert Sales data
 */
async function insertSalesData(data: any[]) {
  try {
    await executeSql('DELETE FROM Sales');
    for (const item of data) {
      await executeSql(
        'INSERT INTO Sales (UserID, DistributorID, CustomerID, Month, ItemID, Quantity, Value, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [String(item.UserID || ''), String(item.DistributorID || ''), String(item.CustomerID || ''), item.Month || 0, String(item.ItemID || ''), String(item.Quantity || ''), String(item.Value || ''), String(item.user_id || '')]
      );
    }
    console.log('PWA: Sales inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertSalesData error', error);
  }
}

/**
 * Insert SalesYTD data
 */
async function insertSalesYTD(data: any[]) {
  try {
    await executeSql('DELETE FROM SalesYTD');
    for (const item of data) {
      await executeSql(
        'INSERT INTO SalesYTD (UserID, DistributorID, CustomerID, ItemID, Quantity, Value, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [String(item.UserID || ''), String(item.DistributorID || ''), String(item.CustomerID || ''), String(item.ItemID || ''), String(item.Quantity || ''), String(item.Value || ''), String(item.user_id || '')]
      );
    }
    console.log('PWA: SalesYTD inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertSalesYTD error', error);
  }
}

/**
 * Insert PCustomer (Pcustomer) data
 */
async function insertPcustomer(data: any[]) {
  try {
    await executeSql('DELETE FROM Pcustomer');
    for (const item of data) {
      await executeSql(
        `INSERT INTO Pcustomer (CustomerId, Party, LicenceNo, IsActive, ERPCode, RouteID, RouteName, AREAID, AREA, BRANCHID, BRANCH, CUSTOMERCLASSID, CUSTOMERCLASS, CUSTOMERCLASS2ID, CUSTOMERCLASS2, CUSTOMERGROUPID, CUSTOMERGROUP, CUSTOMERSEGMENTID, CUSTOMERSEGMENT, CUSTOMERSUBSEGMENTID, CUSTOMERSUBSEGMENT, LICENCETYPEID, LICENCETYPE, OCTROIZONEID, OCTROIZONE, Outlet_Info, DefaultDistributorId, SchemeID, PriceListId, Latitude, Longitude, userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          String(item.CustomerId || ''), String(item.Party || ''), String(item.LicenceNo || ''),
          String(item.IsActive || ''), String(item.ERPCode || ''), String(item.RouteID || ''),
          String(item.RouteName || ''), String(item.AREAID || ''), String(item.AREA || ''),
          String(item.BRANCHID || ''), String(item.BRANCH || ''), String(item.CUSTOMERCLASSID || ''),
          String(item.CUSTOMERCLASS || ''), String(item.CUSTOMERCLASS2ID || ''), String(item.CUSTOMERCLASS2 || ''),
          String(item.CUSTOMERGROUPID || ''), String(item.CUSTOMERGROUP || ''), String(item.CUSTOMERSEGMENTID || ''),
          String(item.CUSTOMERSEGMENT || ''), String(item.CUSTOMERSUBSEGMENTID || ''), String(item.CUSTOMERSUBSEGMENT || ''),
          String(item.LICENCETYPEID || ''), String(item.LICENCETYPE || ''), String(item.OCTROIZONEID || ''),
          String(item.OCTROIZONE || ''), String(item.Outlet_Info || ''), String(item.DefaultDistributorId || ''),
          String(item.SchemeID || ''), String(item.PriceListId || ''),
          item.Latitude || null, item.Longitude || null,
          String(item.userid || '')
        ]
      );
    }
    console.log('PWA: Pcustomer inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertPcustomer error', error);
  }
}

/**
 * Insert PDistributor data
 */
async function insertPDistributor(data: any[]) {
  try {
    await executeSql('DELETE FROM PDistributor');
    for (const item of data) {
      await executeSql(
        `INSERT INTO PDistributor (DistributorID, Distributor, DistributorAlias, ERPCode, AREAID, AREA, BRANCHID, BRANCH, DISTRIBUTORGROUPID, DISTRIBUTORGROUP, IsSelectedDistributor, DISTRIBUTORINFO, userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          String(item.DistributorID || ''), String(item.Distributor || ''), String(item.DistributorAlias || ''),
          String(item.ERPCode || ''), String(item.AREAID || ''), String(item.AREA || ''),
          String(item.BRANCHID || ''), String(item.BRANCH || ''), String(item.DISTRIBUTORGROUPID || ''),
          String(item.DISTRIBUTORGROUP || ''), String(item.IsSelectedDistributor || ''),
          String(item.DISTRIBUTORINFO || ''), String(item.userid || '')
        ]
      );
    }
    console.log('PWA: PDistributor inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertPDistributor error', error);
  }
}

/**
 * Insert PItem data
 */
async function insertPItem(data: any[]) {
  try {
    await executeSql('DELETE FROM PItem');
    for (const item of data) {
      await executeSql(
        `INSERT INTO PItem (ItemId, Item, ItemAlias, BPC, BPC1, BPC2, ErpCode, Volume, ReportingQuantity, MRP, PTR, BRANDID, BRAND, DIVISIONID, DIVISION, FLAVOURID, FLAVOUR, ITEMCLASSID, ITEMCLASS, ITEMGROUPID, ITEMGROUP, ITEMSIZEID, ITEMSIZE, ITEMSUBGROUPID, ITEMSUBGROUP, ITEMTYPEID, ITEMTYPE, ITEMSEQUENCE, Focus, IsSelectedBrand, IsSelectedBrandProduct, bottleQut, SchemeID, ScanCode, userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          String(item.ItemId || ''), String(item.Item || ''), String(item.ItemAlias || ''),
          String(item.BPC || ''), String(item.BPC1 || ''), String(item.BPC2 || ''),
          String(item.ErpCode || ''), String(item.Volume || ''), String(item.ReportingQuantity || ''),
          String(item.MRP || ''), String(item.PTR || ''), String(item.BRANDID || ''),
          String(item.BRAND || ''), String(item.DIVISIONID || ''), String(item.DIVISION || ''),
          String(item.FLAVOURID || ''), String(item.FLAVOUR || ''), String(item.ITEMCLASSID || ''),
          String(item.ITEMCLASS || ''), String(item.ITEMGROUPID || ''), String(item.ITEMGROUP || ''),
          String(item.ITEMSIZEID || ''), String(item.ITEMSIZE || ''), String(item.ITEMSUBGROUPID || ''),
          String(item.ITEMSUBGROUP || ''), String(item.ITEMTYPEID || ''), String(item.ITEMTYPE || ''),
          String(item.ITEMSEQUENCE || ''), String(item.Focus || ''), String(item.IsSelectedBrand || ''),
          String(item.IsSelectedBrandProduct || ''), String(item.bottleQut || ''),
          String(item.SchemeID || ''), String(item.ScanCode || ''), String(item.userid || '')
        ]
      );
    }
    console.log('PWA: PItem inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertPItem error', error);
  }
}

/**
 * Insert Target data
 */
async function insertTargetData(data: any[]) {
  try {
    await executeSql('DELETE FROM Target');
    for (const item of data) {
      await executeSql(
        'INSERT INTO Target (UserID, TDate, ClassificationID, ClassificationName, Target) VALUES (?, ?, ?, ?, ?)',
        [String(item.UserID || ''), String(item.TDate || ''), String(item.ClassificationID || ''), String(item.ClassificationName || ''), item.Target || 0]
      );
    }
    console.log('PWA: Target inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertTargetData error', error);
  }
}

/**
 * Insert OrderMaster data
 */
async function insertOrderMaster(data: any[]) {
  try {
    for (const item of data) {
      await executeSql(
        `INSERT OR REPLACE INTO OrderMaster (id, Current_date_time, entity_type, entity_id, latitude, longitude, total_amount, from_date, to_date, collection_type, user_id, remark, selected_flag, sync_flag, check_date, DefaultDistributorId, ExpectedDeliveryDate, ActivityStatus, ActivityStart, ActivityEnd, userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          String(item.id || ''), String(item.Current_date_time || ''), String(item.entity_type || ''),
          String(item.entity_id || ''), String(item.latitude || ''), String(item.longitude || ''),
          String(item.total_amount || ''), String(item.from_date || ''), String(item.to_date || ''),
          String(item.collection_type || ''), String(item.user_id || ''), String(item.remark || ''),
          String(item.selected_flag || ''), String(item.sync_flag || ''), String(item.check_date || ''),
          String(item.DefaultDistributorId || ''), String(item.ExpectedDeliveryDate || ''),
          String(item.ActivityStatus || ''), String(item.ActivityStart || ''), String(item.ActivityEnd || ''),
          String(item.userid || '')
        ]
      );
    }
    console.log('PWA: OrderMaster inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertOrderMaster error', error);
  }
}

/**
 * Insert OrderDetails data
 */
async function insertOrderDetailsGetData(data: any[]) {
  try {
    for (const item of data) {
      await executeSql(
        `INSERT INTO OrderDetails (order_id, item_id, item_Name, quantity_one, quantity_two, small_Unit, large_Unit, rate, Amount, selected_flag, sync_flag, bottleQty, BrandId, entityId, CollectionType, userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          String(item.order_id || ''), String(item.item_id || ''), String(item.item_Name || ''),
          String(item.quantity_one || ''), String(item.quantity_two || ''), String(item.small_Unit || ''),
          String(item.large_Unit || ''), String(item.rate || ''), String(item.Amount || ''),
          String(item.selected_flag || ''), String(item.sync_flag || ''), String(item.bottleQty || ''),
          String(item.BrandId || ''), String(item.entityId || ''), String(item.CollectionType || ''),
          String(item.userid || '')
        ]
      );
    }
    console.log('PWA: OrderDetails inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertOrderDetailsGetData error', error);
  }
}

/**
 * Insert PJPMaster data
 */
async function insert_PJPMaster(data: any[]) {
  try {
    await executeSql('DELETE FROM PJPMaster');
    for (const item of data) {
      await executeSql(
        'INSERT INTO PJPMaster (RouteID, RouteName, userid) VALUES (?, ?, ?)',
        [String(item.RouteID || ''), String(item.RouteName || ''), String(item.userid || '')]
      );
    }
    console.log('PWA: PJPMaster inserted:', data.length);
  } catch (error) {
    console.error('PWA: insert_PJPMaster error', error);
  }
}

/**
 * Insert Report data
 */
async function insertReport(data: any[]) {
  try {
    await executeSql('DELETE FROM Report');
    for (const item of data) {
      await executeSql(
        'INSERT INTO Report (MenuKey, Classification, ComboClassification, LabelName, IsActive) VALUES (?, ?, ?, ?, ?)',
        [String(item.MenuKey || ''), String(item.Classification || ''), String(item.ComboClassification || ''), String(item.LabelName || ''), String(item.IsActive || '')]
      );
    }
    console.log('PWA: Report inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertReport error', error);
  }
}

/**
 * Insert OnlineParentArea data
 */
async function insertOnlineParentArea(data: any[]) {
  try {
    await executeSql('DELETE FROM OnlineParentArea');
    for (const item of data) {
      await executeSql(
        'INSERT INTO OnlineParentArea (AreaId, Area) VALUES (?, ?)',
        [item.AreaId || 0, String(item.Area || '')]
      );
    }
    console.log('PWA: OnlineParentArea inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertOnlineParentArea error', error);
  }
}

/**
 * Insert SurveyMaster data
 */
async function insertSurveyMaster(data: any[]) {
  try {
    await executeSql('DELETE FROM SurveyMaster');
    for (const item of data) {
      await executeSql(
        'INSERT INTO SurveyMaster (ID, SurveyName, CompanyName, CustomerID, PublishedDate, TimeRequired, SurveyURL, SurveyDoneDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [String(item.ID || ''), String(item.SurveyName || ''), String(item.CompanyName || ''), String(item.CustomerID || ''), String(item.PublishedDate || ''), String(item.TimeRequired || ''), String(item.SurveyURL || ''), String(item.SurveyDoneDate || '')]
      );
    }
    console.log('PWA: SurveyMaster inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertSurveyMaster error', error);
  }
}

/**
 * Insert Resources data
 */
async function insertResources(data: any[]) {
  try {
    await executeSql('DELETE FROM Resources');
    for (const item of data) {
      await executeSql(
        'INSERT INTO Resources (ID, ResourceName, ParentResourceID, URL, Descreption, FileName, SequenceNo, IsDownloadable, ResourceType, CreatedDate, LastUpdatedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [String(item.ID || ''), String(item.ResourceName || ''), String(item.ParentResourceID || ''), String(item.URL || ''), String(item.Descreption || ''), String(item.FileName || ''), String(item.SequenceNo || ''), String(item.IsDownloadable || ''), String(item.ResourceType || ''), String(item.CreatedDate || ''), String(item.LastUpdatedDate || '')]
      );
    }
    console.log('PWA: Resources inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertResources error', error);
  }
}

/**
 * Insert DistributorContacts data
 */
async function insertDistributorContacts(data: any[]) {
  try {
    await executeSql('DELETE FROM DistributorContacts');
    for (const item of data) {
      await executeSql(
        'INSERT INTO DistributorContacts (DistributorID, SequenceNo, ContactPerson, ContactNumber, userid) VALUES (?, ?, ?, ?, ?)',
        [String(item.DistributorID || ''), String(item.SequenceNo || ''), String(item.ContactPerson || ''), String(item.ContactNumber || ''), String(item.userid || '')]
      );
    }
    console.log('PWA: DistributorContacts inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertDistributorContacts error', error);
  }
}

/**
 * Insert DistributorDataStatus data
 */
async function insertDistributorDataStatus(data: any[]) {
  try {
    await executeSql('DELETE FROM DistributorDataStatus');
    for (const item of data) {
      await executeSql(
        'INSERT INTO DistributorDataStatus (Branch, DistributorID, Area, Day7, Day6, Day5, Day4, Day3, Day2, Day1, LastUploadDate, LastInvoiceDate, userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [String(item.Branch || ''), String(item.DistributorID || ''), String(item.Area || ''), String(item.Day7 || ''), String(item.Day6 || ''), String(item.Day5 || ''), String(item.Day4 || ''), String(item.Day3 || ''), String(item.Day2 || ''), String(item.Day1 || ''), String(item.LastUploadDate || ''), String(item.LastInvoiceDate || ''), String(item.userid || '')]
      );
    }
    console.log('PWA: DistributorDataStatus inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertDistributorDataStatus error', error);
  }
}

/**
 * Insert VW_PendingOrders data
 */
async function insertVW_PendingOrders(data: any[]) {
  try {
    await executeSql('DELETE FROM VW_PendingOrders');
    for (const item of data) {
      await executeSql(
        'INSERT INTO VW_PendingOrders (Party, Id, POM_DOC_NO, POM_DOC_DATE, POM_DOC_AMOUNT, POD_ITEM_NAME, POD_SQTY, POD_FQTY, POD_LEDGER_NAME, POD_RNP, POD_RATE, POD_QUANTITY, POD_TOTALDISCOUNT, userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [String(item.Party || ''), String(item.Id || ''), String(item.POM_DOC_NO || ''), String(item.POM_DOC_DATE || ''), String(item.POM_DOC_AMOUNT || ''), String(item.POD_ITEM_NAME || ''), String(item.POD_SQTY || ''), String(item.POD_FQTY || ''), String(item.POD_LEDGER_NAME || ''), String(item.POD_RNP || ''), String(item.POD_RATE || ''), String(item.POD_QUANTITY || ''), String(item.POD_TOTALDISCOUNT || ''), String(item.userid || '')]
      );
    }
    console.log('PWA: VW_PendingOrders inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertVW_PendingOrders error', error);
  }
}

/**
 * Insert ReportControlMaster data
 */
async function insertReportControlMaster(data: any[]) {
  try {
    await executeSql('DELETE FROM ReportControlMaster');
    for (const item of data) {
      await executeSql(
        'INSERT INTO ReportControlMaster (ControlName, ControlId, ReferenceColumn) VALUES (?, ?, ?)',
        [String(item.ControlName || ''), String(item.ControlId || ''), String(item.ReferenceColumn || '')]
      );
    }
    console.log('PWA: ReportControlMaster inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertReportControlMaster error', error);
  }
}

/**
 * Insert UOMMaster data
 */
async function insertuommaster(data: any[]) {
  try {
    await executeSql('DELETE FROM uommaster');
    for (const item of data) {
      await executeSql(
        'INSERT INTO uommaster (UOMDescription, ConvToBase, Formula, UOMKey, IsQuantity, ConversionFormula, ConversionUomFormula) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [String(item.UOMDescription || ''), String(item.ConvToBase || ''), String(item.Formula || ''), String(item.UOMKey || ''), String(item.IsQuantity || ''), String(item.ConversionFormula || ''), String(item.ConversionUomFormula || '')]
      );
    }
    console.log('PWA: uommaster inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertuommaster error', error);
  }
}

/**
 * Insert DiscountMaster data
 */
async function insert_DiscountMaster(data: any[]) {
  try {
    await executeSql('DELETE FROM DiscountMaster');
    for (const item of data) {
      await executeSql(
        'INSERT INTO DiscountMaster (ID, Code, DT_DESC, userid) VALUES (?, ?, ?, ?)',
        [String(item.ID || ''), String(item.Code || ''), String(item.DT_DESC || ''), String(item.userid || '')]
      );
    }
    console.log('PWA: DiscountMaster inserted:', data.length);
  } catch (error) {
    console.error('PWA: insert_DiscountMaster error', error);
  }
}

/**
 * Insert SchemeMaster data
 */
async function insert_SchemeMaster(data: any[]) {
  try {
    await executeSql('DELETE FROM SchemeMaster');
    for (const item of data) {
      await executeSql(
        'INSERT INTO SchemeMaster (ID, Code, DT_DESC, userid) VALUES (?, ?, ?, ?)',
        [String(item.ID || ''), String(item.Code || ''), String(item.DT_DESC || ''), String(item.userid || '')]
      );
    }
    console.log('PWA: SchemeMaster inserted:', data.length);
  } catch (error) {
    console.error('PWA: insert_SchemeMaster error', error);
  }
}

/**
 * Insert PriceListClassification data
 */
async function insert_PriceListClassification(data: any[]) {
  try {
    await executeSql('DELETE FROM PriceListClassification');
    for (const item of data) {
      await executeSql(
        'INSERT INTO PriceListClassification (ClassificationId, ItemId, Price, DistributorId, userid) VALUES (?, ?, ?, ?, ?)',
        [String(item.ClassificationId || ''), String(item.ItemId || ''), String(item.Price || ''), String(item.DistributorId || ''), String(item.userid || '')]
      );
    }
    console.log('PWA: PriceListClassification inserted:', data.length);
  } catch (error) {
    console.error('PWA: insert_PriceListClassification error', error);
  }
}

/**
 * Insert MJPMaster data
 */
async function insertMJPMaster(data: any[]) {
  try {
    await executeSql('DELETE FROM MJPMaster');
    for (const item of data) {
      await executeSql(
        'INSERT INTO MJPMaster (ID, ExecutiveId, MonthYear, userid) VALUES (?, ?, ?, ?)',
        [String(item.ID || ''), String(item.ExecutiveId || ''), String(item.MonthYear || ''), String(item.userid || '')]
      );
    }
    console.log('PWA: MJPMaster inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertMJPMaster error', error);
  }
}

/**
 * Insert MJPMasterDetails data
 */
async function insertMJPMasterDetails(data: any[]) {
  try {
    await executeSql('DELETE FROM MJPMasterDetails');
    for (const item of data) {
      await executeSql(
        'INSERT INTO MJPMasterDetails (MJPMasterID, PlannedDate, EntityType, EntityTypeID, ActivityTitle, IsActivityDone, userid) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [String(item.MJPMasterID || ''), String(item.PlannedDate || ''), String(item.EntityType || ''), String(item.EntityTypeID || ''), String(item.ActivityTitle || ''), String(item.IsActivityDone || ''), String(item.userid || '')]
      );
    }
    console.log('PWA: MJPMasterDetails inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertMJPMasterDetails error', error);
  }
}

/**
 * Insert SubGroupMaster data
 */
async function insertSubGroupMaster(data: any[]) {
  try {
    await executeSql('DELETE FROM SubGroupMaster');
    for (const item of data) {
      await executeSql(
        'INSERT INTO SubGroupMaster (Id, GroupId, Name) VALUES (?, ?, ?)',
        [String(item.Id || ''), String(item.GroupId || ''), String(item.Name || '')]
      );
    }
    console.log('PWA: SubGroupMaster inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertSubGroupMaster error', error);
  }
}

/**
 * Insert SchemeDetails data
 */
async function insertSchemeDetails_data(data: any[]) {
  try {
    await executeSql('DELETE FROM SchemeDetails');
    for (const item of data) {
      await executeSql(
        'INSERT INTO SchemeDetails (ID, SchemeID, SchemeName, FromDate, ToDate, SlabNo, SchemeBenefits, Remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [String(item.ID || ''), String(item.SchemeID || ''), String(item.SchemeName || ''), String(item.FromDate || ''), String(item.ToDate || ''), String(item.SlabNo || ''), String(item.SchemeBenefits || ''), String(item.Remarks || '')]
      );
    }
    console.log('PWA: SchemeDetails inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertSchemeDetails_data error', error);
  }
}

/**
 * Insert OutstandingDetails data
 */
async function insert_OutstandingDetails(data: any[]) {
  try {
    await executeSql('DELETE FROM OutstandingDetails');
    for (const item of data) {
      await executeSql(
        'INSERT INTO OutstandingDetails (ID, PartyCode, Document, Date, DisPactchDate, Amount, OSAmount, OSDocument, InvoiceDate, DiscountAc, PdcAmt, PdcDate, CDStatus, Narration, TpNo, LedgerCode, CDPercentage, ChqNo, PayslipNo, ReceivedAmt, Lag, UnAllocated, NetOsAmt, VhrNo, PartyName, Location, userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          String(item.ID || ''), String(item.PartyCode || ''), String(item.Document || ''),
          String(item.Date || ''), String(item.DisPactchDate || ''), String(item.Amount || ''),
          String(item.OSAmount || ''), String(item.OSDocument || ''), String(item.InvoiceDate || ''),
          String(item.DiscountAc || ''), String(item.PdcAmt || ''), String(item.PdcDate || ''),
          String(item.CDStatus || ''), String(item.Narration || ''), String(item.TpNo || ''),
          String(item.LedgerCode || ''), String(item.CDPercentage || ''), String(item.ChqNo || ''),
          String(item.PayslipNo || ''), String(item.ReceivedAmt || ''), String(item.Lag || ''),
          String(item.UnAllocated || ''), String(item.NetOsAmt || ''), String(item.VhrNo || ''),
          String(item.PartyName || ''), String(item.Location || ''), String(item.userid || '')
        ]
      );
    }
    console.log('PWA: OutstandingDetails inserted:', data.length);
  } catch (error) {
    console.error('PWA: insert_OutstandingDetails error', error);
  }
}

/**
 * Insert ChequeReturnDetails data
 */
async function insert_ChequeReturnDetails(data: any[]) {
  try {
    await executeSql('DELETE FROM ChequeReturnDetails');
    for (const item of data) {
      await executeSql(
        'INSERT INTO ChequeReturnDetails (ID, PartyCode, ReceiptNo, ReceiptDate, ChqNo, ChqDate, ChqAmt, BankName, Branch, BounceDate, userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [String(item.ID || ''), String(item.PartyCode || ''), String(item.ReceiptNo || ''), String(item.ReceiptDate || ''), String(item.ChqNo || ''), String(item.ChqDate || ''), String(item.ChqAmt || ''), String(item.BankName || ''), String(item.Branch || ''), String(item.BounceDate || ''), String(item.userid || '')]
      );
    }
    console.log('PWA: ChequeReturnDetails inserted:', data.length);
  } catch (error) {
    console.error('PWA: insert_ChequeReturnDetails error', error);
  }
}

/**
 * Insert RO_BankCustomer data
 */
async function insertRO_BankCustomer(data: any[]) {
  try {
    await executeSql('DELETE FROM RO_BankCustomer');
    for (const item of data) {
      await executeSql(
        'INSERT INTO RO_BankCustomer (PartyCode, BankName, AccountNo, IFSC, BankBranch, userid) VALUES (?, ?, ?, ?, ?, ?)',
        [String(item.PartyCode || ''), String(item.BankName || ''), String(item.AccountNo || ''), String(item.IFSC || ''), String(item.BankBranch || ''), String(item.userid || '')]
      );
    }
    console.log('PWA: RO_BankCustomer inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertRO_BankCustomer error', error);
  }
}

/**
 * Delete RO_BankCustomer data
 */
async function deleteRO_BankCustomer() {
  try {
    await executeSql('DELETE FROM RO_BankCustomer');
    console.log('PWA: RO_BankCustomer deleted');
  } catch (error) {
    console.error('PWA: deleteRO_BankCustomer error', error);
  }
}

/**
 * Insert OutletAssetInformation data
 */
async function insertoutletAssetInformation(data: any[]) {
  try {
    await executeSql('DELETE FROM OutletAssetInformation');
    for (const item of data) {
      await executeSql(
        'INSERT INTO OutletAssetInformation (CustomerID, AssetID, AssetQRcode, AssetInformation, ScanFlag, userid) VALUES (?, ?, ?, ?, ?, ?)',
        [String(item.CustomerID || ''), String(item.AssetID || ''), String(item.AssetQRcode || ''), String(item.AssetInformation || ''), String(item.ScanFlag || ''), String(item.userid || '')]
      );
    }
    console.log('PWA: OutletAssetInformation inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertoutletAssetInformation error', error);
  }
}

/**
 * Insert AssetTypeClassificationList data
 */
async function insertoutletAssetTypeClassificationList(data: any[]) {
  try {
    await executeSql('DELETE FROM AssetTypeClassificationList');
    for (const item of data) {
      await executeSql(
        'INSERT INTO AssetTypeClassificationList (AssetTypeID, AssetName, ClassificationList) VALUES (?, ?, ?)',
        [String(item.AssetTypeID || ''), String(item.AssetName || ''), String(item.ClassificationList || '')]
      );
    }
    console.log('PWA: AssetTypeClassificationList inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertoutletAssetTypeClassificationList error', error);
  }
}

/**
 * Insert AssetPlacementVerification data
 */
async function insertAssetData1(data: any[]) {
  try {
    await executeSql('DELETE FROM AssetPlacementVerification');
    for (const item of data) {
      await executeSql(
        'INSERT INTO AssetPlacementVerification (OrderID, AssetID, QRCode, ScanStatus, AssetInformation, Remark, Condition, AuditDate, userid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [String(item.OrderID || ''), String(item.AssetID || ''), String(item.QRCode || ''), String(item.ScanStatus || ''), String(item.AssetInformation || ''), String(item.Remark || ''), String(item.Condition || ''), String(item.AuditDate || ''), String(item.userid || '')]
      );
    }
    console.log('PWA: AssetPlacementVerification inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertAssetData1 error', error);
  }
}

/**
 * Insert payment data
 */
async function insertPaymentData(data: any[]) {
  try {
    await executeSql('DELETE FROM TX_PaymentReceipt_log');
    for (const item of data) {
      await executeSql(
        'INSERT INTO TX_PaymentReceipt_log (ID, ReceivedDateTime, PaymentMode, ChequeNo, ChequeDated, BankDetails, Amount, OutletID, Narration, ExecutiveID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [String(item.ID || ''), String(item.ReceivedDateTime || ''), String(item.PaymentMode || ''), String(item.ChequeNo || ''), String(item.ChequeDated || ''), String(item.BankDetails || ''), String(item.Amount || ''), String(item.OutletID || ''), String(item.Narration || ''), String(item.ExecutiveID || '')]
      );
    }
    console.log('PWA: TX_PaymentReceipt_log inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertPaymentData error', error);
  }
}

/**
 * Insert collection data
 */
async function insertCollectionData(data: any[]) {
  try {
    await executeSql('DELETE FROM TX_Collections_log');
    for (const item of data) {
      await executeSql(
        'INSERT INTO TX_Collections_log (MobileGenPrimaryKey, InvoiceCode, AllocatedAmount, CollectionDatetime, PartyCode) VALUES (?, ?, ?, ?, ?)',
        [String(item.MobileGenPrimaryKey || ''), String(item.InvoiceCode || ''), String(item.AllocatedAmount || ''), String(item.CollectionDatetime || ''), String(item.PartyCode || '')]
      );
    }
    console.log('PWA: TX_Collections_log inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertCollectionData error', error);
  }
}

/**
 * Insert collection detail data
 */
async function insertCollectionDeatailData(data: any[]) {
  try {
    await executeSql('DELETE FROM TX_CollectionsDetails_log');
    for (const item of data) {
      await executeSql(
        'INSERT INTO TX_CollectionsDetails_log (CollectionID, Amount, DiscountType, InvoiceCode) VALUES (?, ?, ?, ?)',
        [String(item.CollectionID || ''), String(item.Amount || ''), String(item.DiscountType || ''), String(item.InvoiceCode || '')]
      );
    }
    console.log('PWA: TX_CollectionsDetails_log inserted:', data.length);
  } catch (error) {
    console.error('PWA: insertCollectionDeatailData error', error);
  }
}

// ============================================================================
// Main insertAllData Function - Matches RN SqlDatabase.ts
// ============================================================================

export async function insertAllData(data: any) {
  console.log('PWA: insertAllData called');
  const abc = await data;

  try {
    await initDatabase();
    await createTables();

    // Insert all data types matching RN implementation
    if (abc?.Settings?.length > 0) {
      await insertSettingData(abc.Settings);
    }

    if (abc?.RO_MultiEntityUser?.length > 0) {
      await insertMultiEntityUser(abc.RO_MultiEntityUser);
    }

    if (abc?.Sales?.length > 0) {
      await insertSalesData(abc.Sales);
    }

    if (abc?.PaymentReceipt_Log?.length > 0) {
      await insertPaymentData(abc.PaymentReceipt_Log);
    }

    if (abc?.Collections_Log?.length > 0) {
      await insertCollectionData(abc.Collections_Log);
    }

    if (abc?.CollectionsDetails_Log?.length > 0) {
      await insertCollectionDeatailData(abc.CollectionsDetails_Log);
    }

    if (abc?.VW_PendingOrders?.length > 0) {
      await insertVW_PendingOrders(abc.VW_PendingOrders);
    }

    if (abc?.SalesYTD?.length > 0) {
      await insertSalesYTD(abc.SalesYTD);
    }

    if (abc?.ReportControlMaster?.length > 0) {
      await insertReportControlMaster(abc.ReportControlMaster);
    }

    if (abc?.UOMMaster?.length > 0) {
      await insertuommaster(abc.UOMMaster);
    }

    if (abc?.OrderMaster?.length > 0) {
      await insertOrderMaster(abc.OrderMaster);
    }

    if (abc?.DiscountMaster?.length > 0) {
      await insert_DiscountMaster(abc.DiscountMaster);
    }

    if (abc?.SchemeMaster?.length > 0) {
      await insert_SchemeMaster(abc.SchemeMaster);
    }

    if (abc?.PriceListClassification?.length > 0) {
      await insert_PriceListClassification(abc.PriceListClassification);
    }

    if (abc?.PJPMaster?.length > 0) {
      await insert_PJPMaster(abc.PJPMaster);
    }

    if (abc?.OrderDetails?.length > 0) {
      await insertOrderDetailsGetData(abc.OrderDetails);
    }

    if (abc?.Resources?.length > 0) {
      await insertResources(abc.Resources);
    }

    if (abc?.OnlineParentArea?.length > 0) {
      await insertOnlineParentArea(abc.OnlineParentArea);
    }

    if (abc?.AssetPlacementVerification?.length > 0) {
      await insertAssetData1(abc.AssetPlacementVerification);
    }

    if (abc?.AssetTypeClassificationList?.length > 0) {
      await insertoutletAssetTypeClassificationList(abc.AssetTypeClassificationList);
    }

    if (abc?.DistributorDataStatus?.length > 0) {
      await insertDistributorDataStatus(abc.DistributorDataStatus);
    }

    if (abc?.DistributorContacts?.length > 0) {
      await insertDistributorContacts(abc.DistributorContacts);
    }

    if (abc?.OutletAssetInformation?.length > 0) {
      await insertoutletAssetInformation(abc.OutletAssetInformation);
    }

    if (abc?.SurveyMaster?.length > 0) {
      await insertSurveyMaster(abc.SurveyMaster);
    }

    if (abc?.Report?.length > 0) {
      await insertReport(abc.Report);
    }

    if (abc?.PCustomer?.length > 0) {
      await insertPcustomer(abc.PCustomer);
    }

    if (abc?.PDistributor?.length > 0) {
      await insertPDistributor(abc.PDistributor);
    }

    if (abc?.PItem?.length > 0) {
      await insertPItem(abc.PItem);
    }

    if (abc?.Target?.length > 0) {
      await insertTargetData(abc.Target);
    }

    if (abc?.MJPMaster?.length > 0) {
      await insertMJPMaster(abc.MJPMaster);
    }

    if (abc?.MJPMasterDetails?.length > 0) {
      await insertMJPMasterDetails(abc.MJPMasterDetails);
    }

    if (abc?.SubGroupMaster?.length > 0) {
      await insertSubGroupMaster(abc.SubGroupMaster);
    }

    if (abc?.SchemeDetails?.length > 0) {
      await insertSchemeDetails_data(abc.SchemeDetails);
    }

    if (abc?.OutstandingDetails?.length > 0) {
      await insert_OutstandingDetails(abc.OutstandingDetails);
    }

    if (abc?.ChequeReturnDetails?.length > 0) {
      await insert_ChequeReturnDetails(abc.ChequeReturnDetails);
    }

    if (abc?.RO_BankCustomer?.length > 0) {
      await insertRO_BankCustomer(abc.RO_BankCustomer);
    } else {
      await deleteRO_BankCustomer();
    }

    await saveDatabase();
    console.log('PWA: insertAllData completed successfully');
  } catch (error) {
    console.error('PWA: insertAllData error', error);
  }
}

export async function getAppsideLogWriting(): Promise<any[]> {
  console.log('PWA: getAppsideLogWriting called');
  // TODO: Implement - queries Setting table for log writing config
  try {
    const result = await executeSelect(
      'SELECT * FROM Setting WHERE Name = ?',
      ['AppLogWriting']
    );
    return result;
  } catch (error) {
    console.error('PWA: getAppsideLogWriting error', error);
    return [];
  }
}

export async function getShopLocationForSync(): Promise<any[]> {
  console.log('PWA: getShopLocationForSync called');
  try {
    const result = await executeSelect(
      `SELECT CustomerId, Latitude, Longitude
       FROM Pcustomer
       WHERE Latitude IS NOT NULL
       AND Longitude IS NOT NULL`
    );
    return result;
  } catch (error) {
    console.error('PWA: getShopLocationForSync error', error);
    return [];
  }
}

// Additional placeholder exports for other frequently used functions
export async function getRouteData(): Promise<any[]> {
  try {
    return await executeSelect('SELECT * FROM PJPMaster');
  } catch (error) {
    console.error('PWA: getRouteData error', error);
    return [];
  }
}

export async function getShopsByRoute(routeId: string): Promise<any[]> {
  try {
    return await executeSelect(
      'SELECT * FROM Pcustomer WHERE RouteID = ?',
      [routeId]
    );
  } catch (error) {
    console.error('PWA: getShopsByRoute error', error);
    return [];
  }
}

export async function getOutletDetails(customerId: string): Promise<any> {
  try {
    const result = await executeSelect(
      'SELECT * FROM Pcustomer WHERE CustomerId = ?',
      [customerId]
    );
    return result[0] || null;
  } catch (error) {
    console.error('PWA: getOutletDetails error', error);
    return null;
  }
}

export async function getBrandData(): Promise<any[]> {
  try {
    // Get distinct brands from PItem table
    return await executeSelect('SELECT DISTINCT BRANDID, BRAND FROM PItem WHERE BRAND IS NOT NULL AND BRAND != ""');
  } catch (error) {
    console.error('PWA: getBrandData error', error);
    return [];
  }
}

export async function getCategoryData(): Promise<any[]> {
  try {
    // Get distinct item groups from PItem table (similar to categories)
    return await executeSelect('SELECT DISTINCT ITEMGROUPID, ITEMGROUP FROM PItem WHERE ITEMGROUP IS NOT NULL AND ITEMGROUP != ""');
  } catch (error) {
    console.error('PWA: getCategoryData error', error);
    return [];
  }
}

export async function getSKUData(): Promise<any[]> {
  try {
    return await executeSelect('SELECT * FROM PItem');
  } catch (error) {
    console.error('PWA: getSKUData error', error);
    return [];
  }
}

export async function getSettingValue(key: string): Promise<string | null> {
  try {
    const result = await executeSelect<{Value: string}>(
      'SELECT Value FROM Setting WHERE Name = ?',
      [key]
    );
    return result[0]?.Value || null;
  } catch (error) {
    console.error('PWA: getSettingValue error', error);
    return null;
  }
}

export async function setSettingValue(key: string, value: string): Promise<void> {
  try {
    await executeSql(
      'INSERT OR REPLACE INTO Setting (Name, Value) VALUES (?, ?)',
      [key, value]
    );
  } catch (error) {
    console.error('PWA: setSettingValue error', error);
  }
}

// Dashboard-specific functions

/**
 * Get last sync time
 */
export async function getLastSync(): Promise<{Value: string} | null> {
  try {
    const result = await executeSelect<{Value: string}>(
      'SELECT Value FROM Setting WHERE Name = ?',
      ['LastSync']
    );
    return result[0] || null;
  } catch (error) {
    console.error('PWA: getLastSync error', error);
    return null;
  }
}

/**
 * Get attendance for a specific date (collection_type = 8 for IN)
 */
export async function getAttendance(date: string): Promise<{id: string}[]> {
  try {
    const result = await executeSelect<{id: string}>(
      `SELECT id FROM OrderMaster WHERE collection_type = 8 AND from_date = ?`,
      [date]
    );
    return result;
  } catch (error) {
    console.error('PWA: getAttendance error', error);
    return [];
  }
}

/**
 * Get attendance out for a specific date (collection_type = 9 for OUT)
 */
export async function getAttendance2(date: string): Promise<{id: string}[]> {
  try {
    const result = await executeSelect<{id: string}>(
      `SELECT id FROM OrderMaster WHERE collection_type = 9 AND from_date = ?`,
      [date]
    );
    return result;
  } catch (error) {
    console.error('PWA: getAttendance2 error', error);
    return [];
  }
}

/**
 * Get attendance end day data (collection_type = 9 for OUT)
 */
export async function getAttendanceEndDay(date: string): Promise<{id: string}[]> {
  try {
    const result = await executeSelect<{id: string}>(
      `SELECT id FROM OrderMaster WHERE collection_type = 9 AND from_date = ?`,
      [date]
    );
    return result;
  } catch (error) {
    console.error('PWA: getAttendanceEndDay error', error);
    return [];
  }
}

/**
 * Get total orders not synced
 */
export async function getTotalOrdersOfOrderMAsternotsync(): Promise<{TotalCount: number}[]> {
  try {
    const result = await executeSelect<{TotalCount: number}>(
      `SELECT COUNT(*) as TotalCount FROM OrderMaster WHERE sync_flag = 0`
    );
    return result;
  } catch (error) {
    console.error('PWA: getTotalOrdersOfOrderMAsternotsync error', error);
    return [{TotalCount: 0}];
  }
}

/**
 * Get auto sync setting
 */
export async function getForAutosync(): Promise<{Value: string}[]> {
  try {
    const result = await executeSelect<{Value: string}>(
      `SELECT Value FROM Setting WHERE Name = ?`,
      ['AutoSync']
    );
    return result;
  } catch (error) {
    console.error('PWA: getForAutosync error', error);
    return [{Value: '0'}];
  }
}

/**
 * Get sync on activity setting
 */
export async function getForSyncOnActivity(): Promise<{Value: string}[]> {
  try {
    const result = await executeSelect<{Value: string}>(
      `SELECT Value FROM Setting WHERE Name = ?`,
      ['SyncOnActivity']
    );
    return result;
  } catch (error) {
    console.error('PWA: getForSyncOnActivity error', error);
    return [{Value: '0'}];
  }
}

/**
 * Get attendance settings
 */
export async function getAttendanceSettings(): Promise<{Value: string}[]> {
  try {
    const result = await executeSelect<{Value: string}>(
      `SELECT Value FROM Setting WHERE Name = ?`,
      ['AttendanceSettings']
    );
    return result;
  } catch (error) {
    console.error('PWA: getAttendanceSettings error', error);
    return [];
  }
}

/**
 * Get order confirm flag setting
 */
export async function getOrderConfirmFlag(): Promise<{Value: string}[]> {
  try {
    const result = await executeSelect<{Value: string}>(
      `SELECT Value FROM Setting WHERE Name = ?`,
      ['OrderConfirmSignature']
    );
    return result;
  } catch (error) {
    console.error('PWA: getOrderConfirmFlag error', error);
    return [];
  }
}

/**
 * Get external share setting
 */
export async function getAppsExtShare(): Promise<{Value: string}[]> {
  try {
    const result = await executeSelect<{Value: string}>(
      `SELECT Value FROM Setting WHERE Name = ?`,
      ['ExternalShare']
    );
    return result;
  } catch (error) {
    console.error('PWA: getAppsExtShare error', error);
    return [];
  }
}

/**
 * Get distributor master data
 */
export async function getDataDistributorMaster(): Promise<any[]> {
  try {
    const result = await executeSelect(
      `SELECT * FROM MultiEntityUser`
    );
    return result;
  } catch (error) {
    console.error('PWA: getDataDistributorMaster error', error);
    return [];
  }
}

/**
 * Get first distributor for user
 */
export async function getDataDistributorMasterFirst(userId: string): Promise<any[]> {
  try {
    const result = await executeSelect(
      `SELECT * FROM MultiEntityUser WHERE UserId = ? LIMIT 1`,
      [userId]
    );
    return result;
  } catch (error) {
    console.error('PWA: getDataDistributorMasterFirst error', error);
    return [];
  }
}

/**
 * Insert attendance record
 */
export async function insertAttendance(
  userId: string,
  attendanceType: string,
  attendanceDate: string,
  attendanceTime: string,
  latitude: number | null,
  longitude: number | null,
  remark: string,
  isDayEnd: number = 0
): Promise<void> {
  try {
    await executeSql(
      `INSERT INTO Attendance (
        UserId, AttendanceType, AttendanceDate, AttendanceTime,
        Latitude, Longitude, Remark, IsDayEnd, SyncFlag
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [userId, attendanceType, attendanceDate, attendanceTime, latitude, longitude, remark, isDayEnd]
    );
    await saveDatabase();
  } catch (error) {
    console.error('PWA: insertAttendance error', error);
  }
}

/**
 * Insert uses log
 */
export async function insertuses_log(
  userId: string,
  activity: string,
  dateTime: string
): Promise<void> {
  try {
    await executeSql(
      `INSERT INTO UsesLog (UserId, Activity, DateTime, SyncFlag) VALUES (?, ?, ?, 0)`,
      [userId, activity, dateTime]
    );
    await saveDatabase();
  } catch (error) {
    console.error('PWA: insertuses_log error', error);
  }
}

/**
 * Get Report Classification for Brand Wise Sales (Report1)
 */
export async function getClassificationfromDBReport1(): Promise<any[]> {
  try {
    const results = await executeSelect(
      'SELECT * FROM Report WHERE MenuKey = ?',
      ['Report1']
    );
    return results || [];
  } catch (error) {
    console.error('PWA: getClassificationfromDBReport1 error', error);
    return [];
  }
}

/**
 * Get Report Classification for Target vs Achievement (Report2)
 */
export async function getClassificationfromDBReport2(): Promise<any[]> {
  try {
    const results = await executeSelect(
      'SELECT * FROM Report WHERE MenuKey = ?',
      ['Report2']
    );
    return results || [];
  } catch (error) {
    console.error('PWA: getClassificationfromDBReport2 error', error);
    return [];
  }
}

/**
 * Get Report Classification for Report3
 */
export async function getClassificationfromDBReport3(): Promise<any[]> {
  try {
    const results = await executeSelect(
      'SELECT * FROM Report WHERE MenuKey = ?',
      ['Report3']
    );
    return results || [];
  } catch (error) {
    console.error('PWA: getClassificationfromDBReport3 error', error);
    return [];
  }
}

/**
 * Get Control ID from ReportControlMaster
 */
export async function getControlId(key: string): Promise<any> {
  try {
    const results = await executeSelect(
      'SELECT ControlId FROM ReportControlMaster WHERE ReferenceColumn = ?',
      [key]
    );
    return results?.[0] || null;
  } catch (error) {
    console.error('PWA: getControlId error', error);
    return null;
  }
}

/**
 * Get all brand list based on ControlId
 */
export async function getAllBrandList(ControlId: string, uid: string): Promise<any[]> {
  try {
    const query = `SELECT DISTINCT ${ControlId} as BRAND, ${ControlId}ID as BRANDID, IsSelectedBrand, IsSelectedBrandProduct FROM PItem WHERE userid = ? ORDER BY ${ControlId}`;
    const results = await executeSelect(query, [uid]);
    return results || [];
  } catch (error) {
    console.error('PWA: getAllBrandList error', error);
    return [];
  }
}

/**
 * Get UOM List
 */
export async function getUOMList(): Promise<any[]> {
  try {
    const results = await executeSelect(
      'SELECT id, UOMDescription FROM uommaster',
      []
    );
    return results || [];
  } catch (error) {
    console.error('PWA: getUOMList error', error);
    return [];
  }
}

/**
 * Get Outlet/Party list for reports
 */
export async function getOutletParty(): Promise<any[]> {
  try {
    const results = await executeSelect(
      'SELECT DISTINCT Party, CustomerId FROM Pcustomer',
      []
    );
    return results || [];
  } catch (error) {
    console.error('PWA: getOutletParty error', error);
    return [];
  }
}

/**
 * Get Brands for user (Outlet Performance Report)
 */
export async function getBrands(uid: string): Promise<any[]> {
  try {
    const results = await executeSelect(
      'SELECT DISTINCT BRAND, BRANDID FROM PItem WHERE userid = ? ORDER BY BRAND',
      [uid]
    );
    return results || [];
  } catch (error) {
    console.error('PWA: getBrands error', error);
    return [];
  }
}

/**
 * Get SKU for user (Outlet Performance Report)
 */
export async function getSKU(uid: string): Promise<any[]> {
  try {
    const results = await executeSelect(
      'SELECT DISTINCT Item, ItemId FROM PItem WHERE userid = ? ORDER BY Item',
      [uid]
    );
    return results || [];
  } catch (error) {
    console.error('PWA: getSKU error', error);
    return [];
  }
}

/**
 * Get Size for user (Outlet Performance Report)
 */
export async function getSize(uid: string): Promise<any[]> {
  try {
    const results = await executeSelect(
      'SELECT DISTINCT ITEMSIZE, ITEMSIZEID, Item FROM PItem WHERE userid = ? ORDER BY Item',
      [uid]
    );
    return results || [];
  } catch (error) {
    console.error('PWA: getSize error', error);
    return [];
  }
}

/**
 * Get Distributor Data for user
 */
export async function getDistributorData(uid: string): Promise<any[]> {
  try {
    const results = await executeSelect(
      'SELECT DISTINCT DistributorID, Distributor FROM PDistributor WHERE userid = ? ORDER BY Distributor',
      [uid]
    );
    return results || [];
  } catch (error) {
    console.error('PWA: getDistributorData error', error);
    return [];
  }
}

/**
 * Get all distributors
 */
export async function GetAllDistributors(): Promise<any[]> {
  try {
    const results = await executeSelect(
      'SELECT DISTINCT DistributorID, Distributor FROM PDistributor ORDER BY Distributor ASC',
      []
    );
    return results || [];
  } catch (error) {
    console.error('PWA: GetAllDistributors error', error);
    return [];
  }
}

/**
 * Get activity data for last 3 days (My Activity Report)
 */
export async function getmyactivitydataget(
  currentdate: string,
  yesterdaysdate: string,
  dayafteryesterdays: string
): Promise<{today: any[]; yesterday: any[]; dayBefore: any[]}> {
  try {
    const queryToday = `SELECT DISTINCT OrderMaster.entity_id, OrderMaster.from_date, Pcustomer.Party, Pcustomer.CustomerId
      FROM OrderMaster
      LEFT JOIN Pcustomer ON OrderMaster.entity_id = Pcustomer.CustomerId
      WHERE OrderMaster.from_date = ?`;

    const queryYesterday = `SELECT DISTINCT OrderMaster.entity_id, OrderMaster.from_date, Pcustomer.Party, Pcustomer.CustomerId
      FROM OrderMaster
      LEFT JOIN Pcustomer ON OrderMaster.entity_id = Pcustomer.CustomerId
      WHERE OrderMaster.from_date = ?`;

    const queryDayBefore = `SELECT DISTINCT OrderMaster.entity_id, OrderMaster.from_date, Pcustomer.Party, Pcustomer.CustomerId
      FROM OrderMaster
      LEFT JOIN Pcustomer ON OrderMaster.entity_id = Pcustomer.CustomerId
      WHERE OrderMaster.from_date = ?`;

    const [today, yesterday, dayBefore] = await Promise.all([
      executeSelect(queryToday, [currentdate]),
      executeSelect(queryYesterday, [yesterdaysdate]),
      executeSelect(queryDayBefore, [dayafteryesterdays]),
    ]);

    return {
      today: today || [],
      yesterday: yesterday || [],
      dayBefore: dayBefore || [],
    };
  } catch (error) {
    console.error('PWA: getmyactivitydataget error', error);
    return {today: [], yesterday: [], dayBefore: []};
  }
}

/**
 * Get order booked details for outlet (Outlet Visit Activity)
 */
export async function checkorderbookeddetails(entity_id: string, uid: string): Promise<any[]> {
  try {
    const query = `SELECT DISTINCT Current_date_time, OrderMaster.from_date, ActivityStart, ActivityEnd, collection_type,
      OrderMaster.id, OrderDetails.item_id, OrderDetails.quantity_one, OrderDetails.quantity_two,
      OrderDetails.small_Unit, OrderDetails.large_Unit, OrderDetails.Amount, PItem.Item
      FROM OrderMaster
      LEFT JOIN OrderDetails ON OrderMaster.id = OrderDetails.order_id
      LEFT JOIN PItem ON OrderDetails.item_id = PItem.ItemId
      WHERE OrderMaster.entity_id = ? AND OrderMaster.userid = ?`;

    const results = await executeSelect(query, [entity_id, uid]);
    return results || [];
  } catch (error) {
    console.error('PWA: checkorderbookeddetails error', error);
    return [];
  }
}

/**
 * Get all orders in OrderMaster for specific dates (My Activity Report)
 */
export async function checkallordersinordermaster(
  entity_id: string,
  _currentDate: string,
  _yesterdaydate: string,
  _dayafteryesterdays: string,
  date: string,
  uid: string
): Promise<any[]> {
  try {
    const query = `SELECT Current_date_time, OrderMaster.from_date, ActivityStart, ActivityEnd, collection_type,
      OrderMaster.id, OrderDetails.item_id, OrderDetails.quantity_one, OrderDetails.quantity_two,
      OrderDetails.Amount, PItem.Item
      FROM OrderMaster
      LEFT JOIN OrderDetails ON OrderMaster.id = OrderDetails.order_id
      LEFT JOIN PItem ON OrderDetails.item_id = PItem.ItemId
      WHERE OrderMaster.entity_id = ? AND OrderMaster.from_date = ? AND OrderMaster.userid = ?`;

    const results = await executeSelect(query, [entity_id, date, uid]);
    return results || [];
  } catch (error) {
    console.error('PWA: checkallordersinordermaster error', error);
    return [];
  }
}

/**
 * Get customer data from Pcustomer
 */
export async function getdatafromcust(entity_id: string, uid: string): Promise<any[]> {
  try {
    const results = await executeSelect(
      'SELECT * FROM Pcustomer WHERE CustomerId = ? AND userid = ?',
      [entity_id, uid]
    );
    return results || [];
  } catch (error) {
    console.error('PWA: getdatafromcust error', error);
    return [];
  }
}

/**
 * Get distributor data from PDistributor
 */
export async function getdatafromdist(entity_id: string, uid: string): Promise<any[]> {
  try {
    const results = await executeSelect(
      'SELECT Distributor as Party, AREA as AREA FROM PDistributor WHERE DistributorID = ? AND userid = ?',
      [entity_id, uid]
    );
    return results || [];
  } catch (error) {
    console.error('PWA: getdatafromdist error', error);
    return [];
  }
}

/**
 * Get data for activity (distinct entity_ids from OrderMaster)
 */
export async function getDataForActivity(): Promise<any[]> {
  try {
    const results = await executeSelect(
      'SELECT DISTINCT entity_id FROM OrderMaster',
      []
    );
    return results || [];
  } catch (error) {
    console.error('PWA: getDataForActivity error', error);
    return [];
  }
}

/**
 * Get Item IDs from Brand IDs
 */
export async function getItemIDFromBrandId(brandIDs: string[]): Promise<any[]> {
  try {
    if (!brandIDs.length) return [];
    const placeholders = brandIDs.map(() => '?').join(',');
    const query = `SELECT DISTINCT ItemId FROM PItem WHERE BRANDID IN (${placeholders})`;
    const results = await executeSelect(query, brandIDs);
    return results || [];
  } catch (error) {
    console.error('PWA: getItemIDFromBrandId error', error);
    return [];
  }
}

/**
 * Get location of outlets for map view
 */
export async function getLocationOfOutlets(route_id: string): Promise<any[]> {
  try {
    const results = await executeSelect(
      'SELECT * FROM Pcustomer WHERE route_id = ?',
      [route_id]
    );
    return results || [];
  } catch (error) {
    console.error('PWA: getLocationOfOutlets error', error);
    return [];
  }
}

/**
 * Get online parent area data for location/area selection
 */
export async function getOnlineParentAreaData(): Promise<any[]> {
  try {
    const results = await executeSelect(
      'SELECT AreaId, Area FROM OnlineParentArea ORDER BY Area ASC',
      []
    );
    return results || [];
  } catch (error) {
    console.error('PWA: getOnlineParentAreaData error', error);
    return [];
  }
}

/**
 * Get multi distributor user IDs
 */
export async function getMultiDistributorUserId(): Promise<{Userid: string}[]> {
  try {
    const result = await executeSelect<{Userid: string}>(
      'SELECT Userid FROM MultiEntityUser',
      []
    );
    return result;
  } catch (error) {
    console.error('PWA: getMultiDistributorUserId error', error);
    return [];
  }
}

/**
 * Insert record in OrderMaster for shop check-in (attendance)
 */
export async function insertRecordInOrderMasterForShopCheckIn(
  id: string,
  Current_date_time: string,
  entity_type: string,
  entity_id: string | number,
  latitude: string | number,
  longitude: string | number,
  total_amount: string | number,
  from_date: string,
  to_date: string,
  collection_type: string | number,
  user_id: string | number,
  selected_flag: string,
  sync_flag: string,
  remark: string,
  check_date: string,
  DefaultDistributorId: string | number,
  ExpectedDeliveryDate: string,
  Activitystatus: string,
  activityStart: string,
  activityend: string,
  uid: string | number,
): Promise<any> {
  console.log(
    'check in OMast colll type --->',
    collection_type,
    'app_o_id--->',
    id,
    uid,
    user_id,
    entity_id,
  );
  try {
    const result = await executeSql(
      `INSERT INTO OrderMaster(id,Current_date_time,entity_type,entity_id,latitude,
        longitude,total_amount,from_date,to_date,collection_type,user_id,selected_flag,sync_flag,remark,check_date,DefaultDistributorId,ExpectedDeliveryDate,ActivityStatus,ActivityStart,ActivityEnd,userid)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        String(id),
        String(Current_date_time),
        String(entity_type),
        String(entity_id),
        String(latitude),
        String(longitude),
        String(total_amount),
        String(from_date),
        String(to_date),
        String(collection_type),
        String(user_id),
        String(selected_flag),
        String(sync_flag),
        String(remark),
        String(check_date),
        String(DefaultDistributorId),
        String(ExpectedDeliveryDate),
        String(Activitystatus),
        String(activityStart),
        String(activityend),
        String(uid),
      ]
    );
    return result;
  } catch (error) {
    console.error('PWA: insertRecordInOrderMasterForShopCheckIn error', error);
    return null;
  }
}

export default {
  SqlDB,
  createTables,
  insertAllData,
  getAppsideLogWriting,
  getShopLocationForSync,
  getRouteData,
  getShopsByRoute,
  getOutletDetails,
  getBrandData,
  getCategoryData,
  getSKUData,
  getSettingValue,
  setSettingValue,
  getLastSync,
  getAttendance,
  getAttendance2,
  getAttendanceEndDay,
  getTotalOrdersOfOrderMAsternotsync,
  getForAutosync,
  getForSyncOnActivity,
  getAttendanceSettings,
  getOrderConfirmFlag,
  getAppsExtShare,
  getDataDistributorMaster,
  getDataDistributorMasterFirst,
  insertAttendance,
  insertuses_log,
  // Report functions
  getClassificationfromDBReport1,
  getClassificationfromDBReport2,
  getClassificationfromDBReport3,
  getControlId,
  getAllBrandList,
  getUOMList,
  getOutletParty,
  getBrands,
  getSKU,
  getSize,
  getDistributorData,
  GetAllDistributors,
  getmyactivitydataget,
  checkorderbookeddetails,
  checkallordersinordermaster,
  getdatafromcust,
  getdatafromdist,
  getDataForActivity,
  getItemIDFromBrandId,
  // Attendance functions
  getMultiDistributorUserId,
  insertRecordInOrderMasterForShopCheckIn,
  getOnlineParentAreaData,
};
