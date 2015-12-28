<?
class MyConnector{
    var  $db;
	var $stmt;
	var $filename;
	function MyConnector($folder){		
		$filename= $folder.'/data/directories.db';
		if($folder && file_exists($filename)){
			$this->db = new PDO('sqlite:'.$filename);
			$this->filename=$filename;
		}else	{
			$this->db  = new PDO('mysql:host=localhost;dbname=frontdes_dir', 'frontdes', 'zaq12wsxcde34rfv');	
		}
	}	

	function getFilename(){
		return $this->filename;
	}
	
	function getRows($sql){
		$res = $this->db->query($sql);
		if($res) return $res->fetchAll(PDO::FETCH_ASSOC);
		return 0;
		
	}
	function getField($sql){
		$res = $this->db->query($sql);
		if($res) return $res->fetchColumn();
		return 0;
	}
	function queryPure($sql){
		return  $this->db->query($sql);
	}
		
	
	function getAsArray($sql){
		return  $this->db->query($sql)->fetchAll(PDO::FETCH_NUM);
	}
	function getAllAsObj($sql){
		return  $this->db->query($sql)->fetchAll(PDO::FETCH_OBJ);
	}
	function query($sql,$ar){			
			$stmt =   $this->db->prepare($sql);
			if(!$stmt) return $this->db->errorInfo();
			$res = $stmt->execute($ar);			
			if($res)return $stmt->fetchAll(PDO::FETCH_OBJ);
			return  $this->db->errorInfo();		
		//return $stmt->execute($arVars);		
	}
	function queryA($sql,$ar){
		$stmt =   $this->db->prepare($sql);
		if($stmt){
			$res = $stmt->execute($ar);	
			if($res) return $stmt->fetchAll(PDO::FETCH_ASSOC);
		}
		return 0;
	}
	function getNextAsSoc($result){
		return $result->fetch(PDO::FETCH_ASSOC);
	}
	function updateRow($sql,$ar){
			$stmt = $this->db->prepare($sql);
			if($stmt) return  $stmt->execute($ar);
		return	0;
	}
	function beginTransaction($sql){
		$this->db->beginTransaction();
		$this->stmt=$this->db->prepare($sql);
		
	}
	function prepare($sql){
			return $this->db->prepare($sql);
	}
	
	function commit(){
		return $this->db()-> commit();
	}
	function errorInfo(){
	return $this->db->errorInfo();
	}
	
	function insertRow($sql,$ar){
			$stmt = $this->db->prepare($sql);
			if(!$stmt) return 0;
		 	$res = $stmt->execute($ar);
			if($res) return $this->db->lastInsertId();
			return 0;
	}
	
}