import React from 'react';
import type { Record, RecordType } from '!@prisma/client';
import { keyBy } from 'lodash';

interface RecordListProps {
  records: Record[];
  recordTypes: RecordType[];
}

const RecordList: React.FC<RecordListProps> = ({ records, recordTypes }) => {
  const recordTypesById = keyBy(recordTypes, 'id');

  return (
    <>
      {records.map((record) => (
        <a href={`/entry/${record.id}`} key={record.id}>
          <div className="card my-2 p-2">
            <h6 className="card-subtitle">{recordTypesById[record.typeId].name}</h6>
            {record.startsAt.toLocaleString()}
          </div>
        </a>
      ))}
    </>
  );
};

export default RecordList;