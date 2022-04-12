import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Stack, Button, FormControl, Typography, MenuItem, } from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Select from '@mui/material/Select';
import CustomizedDialogs from './createModal'
import './dashboard.css'
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';

export default function DataGridDemo({ searchTerm }) {

  const columns = [
    {
      field: 'title',
      headerName: 'Track Title',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'artist',
      headerName: 'Artist',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'isrc',
      headerName: 'ISRC',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'label',
      headerName: 'Label',
      sortable: true,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'releaseDate',
      headerName: 'Release Date',
      sortable: true,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'comments',
      headerName: 'Notes',
      sortable: false,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <QuestionAnswerIcon />
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack direction="row" spacing={3}>
          <EditIcon className="icon editIcon" onClick={(() => editModal(params))} />
          <DeleteIcon />
        </Stack>
      ),
    },
  ];

  const [rows, setRows] = React.useState([]);
  const [limit, setLimit] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [param, setParam] = React.useState(null);
  const [loading, setLoading] = React.useState(false)
  const [height, setHeight] = React.useState(578)
  const [totalPages, setTotalPages] = React.useState()

  const [searchCriteria, setSearchCriteria] = React.useState({
    searchTerm: "",
    itemsPerPage: "10",
    pageNumber: "1",
    sortColumn: "",
    sortOrder: "",
    filter: {}
  })

  const handleChange = (event) => {
    setLimit(event.target.value);
    setSearchCriteria({ ...searchCriteria, itemsPerPage: event.target.value.toString() })
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setParam(null)
  };

  const editModal = (params) => {
    setParam(params)
    handleClickOpen()
  }

  const addRow = (values) => {
    setRows([...rows, values]);
    setOpen(false);
  }

  const updateRow = (values) => {
    let updatedRows = rows.map(el => {
      if (el.id === values.id) {
        console.log(el, "came", values)
        return values
      }
      return el
    })
    setRows(updatedRows);
    setOpen(false);
  }

  React.useEffect(() => {
    setLoading(true)
    axios.post(`https://api.dev.cp3.umgapps.com/api/TrackSearch`, { searchCriteria: searchCriteria }, {
    })
      .then(res => {
        setRows(res.data.tracks)
        setLoading(false)
        setTotalPages(res.data.totalPages)
      })
  }, [searchCriteria, searchTerm])

  React.useEffect(() => {
    if (searchTerm) {
      setSearchCriteria({ ...searchCriteria, searchTerm: searchTerm })
    }
  }, [searchTerm])

  const onSortModelChange = (data) => {
    setSearchCriteria({ ...searchCriteria, sortColumn: data[0].field, sortOrder: data[0].sort })
  }

  const handlePageChange = (e, page) => {
    setSearchCriteria({ ...searchCriteria, pageNumber: page.toString() })
  }

  const loadMore = () => {
    const { itemsPerPage } = searchCriteria
    const perPage = parseInt(itemsPerPage) + 10
    setLimit(perPage)
    if (perPage <= 100) {
      setSearchCriteria({ ...searchCriteria, itemsPerPage: perPage.toString() })
      setHeight(578 * perPage / 10)
    }
  }

  return (
    <Box
      display="flex"
      flexDirection='column'
      justifyContent="center"
      alignItems="center"
      mt='50px'
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {open && <CustomizedDialogs addRow={addRow}
        open={open}
        handleClickOpen={handleClickOpen}
        param={param}
        handleClose={handleClose}
        updateRow={updateRow}
      />}
      <Stack direction="row" spacing={3}
        sx={{
          display: "flex",
          justifyContent: 'space-between',
          width: '90%',
          mb: '20px'
        }}>
        <FormControl sx={{}}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} >
            Viewing&nbsp;
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={limit}
              onChange={handleChange}
              autoWidth
              size='small'
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
            &nbsp;of {totalPages} Results
          </Typography>
        </FormControl>
        <Pagination
          count={totalPages ? Number(totalPages) : 0}
          shape="rounded"
          color="primary"
          page={Number(searchCriteria.pageNumber)}
          onChange={handlePageChange}
        />
        <Stack direction="row" spacing={3}>
          <Button onClick={handleClickOpen} variant="contained" startIcon={<AddCircleIcon />} sx={{ bgcolor: 'button.primary', color: 'text.primary', borderRadius: '2px', '&:hover': { bgcolor: '#ddd' } }}>
            Create
          </Button>
          <Button variant="contained" endIcon={<FileDownloadIcon />} sx={{ bgcolor: 'button.primary', color: 'text.primary', borderRadius: '2px', '&:hover': { bgcolor: '#ddd' }, }}>
            Export
          </Button>
        </Stack>
      </Stack>
      <Box
        sx={{
          width: '90%',
          height: height
        }}>
        <DataGrid
          sortingMode='server'
          onSortModelChange={onSortModelChange}
          rows={rows}
          sortingOrder={['asc', 'desc']}
          getRowId={(row) => row.trackId}
          columns={columns}
          pageSize={limit}
          checkboxSelection
          disableSelectionOnClick
          onPageSizeChange={(newPageSize) => console.log(newPageSize)}
          hideFooter={true}
        // components={{
        //   Footer: () => <div>hey a footer</div>,
        // }}
        />
      </Box>
      <Button onClick={loadMore} variant="text" endIcon={<KeyboardArrowDownIcon />} sx={{ mt: '20px', color: 'text.primary', textTransform: 'none', fontWeight: 'bold' }}>
        Load More
      </Button>
    </Box>

  );
}
